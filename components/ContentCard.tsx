"use client";

import Link from "next/link";
import Image from "next/image";
import { type Content } from "@/lib/mock-data";

interface ContentCardProps {
  content: Content;
  isKo: boolean;
}

export default function ContentCard({ content, isKo }: ContentCardProps) {
  return (
    <Link
      href={`/content/${content.id}`}
      className="group block rounded-2xl border border-gray-100 overflow-hidden bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
    >
      <div className="relative h-48 w-full">
        <Image
          src={`https://picsum.photos/seed/${content.id}/600/400`}
          alt={content.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded">
          {content.category}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2">
        <div className="text-xs text-gray-400 font-semibold">{content.publishedAt}</div>
        <h2 className="text-base font-bold leading-snug text-black line-clamp-2">
          {isKo ? content.title : content.titleEs}
        </h2>
        <p className="text-sm text-gray-400 italic line-clamp-2">
          {isKo ? content.summary : content.summaryEs}
        </p>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
          <span>♥</span>
          <span>{content.likes}</span>
        </div>
      </div>
    </Link>
  );
}
