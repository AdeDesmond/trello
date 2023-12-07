"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-items";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const { execute: executeListOrder, fieldErrors } = useAction(
    updateListOrder,
    {
      onSuccess: () => {
        toast.success("List reodered");
      },
      onError: (err) => {
        toast.error(err);
      },
    }
  );
  const {
    execute: executeUpdateCardOrder,
    fieldErrors: updateCardsOrderErrors,
  } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("cards reodered");
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    //if dropped in the same position

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //user moves a lists
    if (type === "list") {
      const items: any = reorder(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));
      setOrderedData(items);
      //TODO trigger server actions later
      executeListOrder({ items, boardId });
    }

    //user moves a card
    if (type === "card") {
      let newOrderData = [...orderedData];

      //source and destination list
      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      );

      const destList = newOrderData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      //Check if cards exists on the source list

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destList.cards) {
        destList.cards = [];
      }

      //Moving the card in the same list

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderData);
        //TODO trrigger server action
        executeUpdateCardOrder({ boardId, items: reorderedCards });
        //User moves the card to another list
      } else {
        //Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        //Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        //Add card to the destinationlist

        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the card order for each card in the destination list

        destList.cards.forEach((card, index) => {
          card.order = index;
        });
        setOrderedData(newOrderData);
        //TODO: trigger server action
        executeUpdateCardOrder({ boardId, items: destList.cards });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
