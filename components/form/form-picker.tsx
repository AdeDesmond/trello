"use client";

import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { defaultImages } from "@/constants/images";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seletectImageId, setSelectedImageId] = useState<string | null>(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const results = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        if (results && results.response) {
          const newImages = results.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.log("error failed to fetch images from unsplash");
          setImages(defaultImages);
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-600 animate-spin" />
      </div>
    );
  }
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
          >
            <Image
              src={image.urls.thumb}
              fill
              alt="unsplash image"
              className="object-cover rounded-sm"
            />
            <input
              type="radio"
              name={id}
              id={id}
              className="hidden"
              checked={seletectImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            {seletectImageId === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                {" "}
                <Check className="h-4 w-4 text-white" />{" "}
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/10 group-hover:opacity-100 opacity-0"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
