import React from "react";
import Link from "next/link";
import {Flex, Button} from "@gravity-ui/uikit";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string; // e.g. '/catalog'
  query?: Record<string, string | number | undefined>;
}

export function Pagination({page, totalPages, basePath, query = {}}: PaginationProps) {
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const buildHref = (p: number) => {
    const params = new URLSearchParams({
      ...Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])),
      page: String(p),
    });
    return `${basePath}?${params.toString()}`;
  };

  return (
    <Flex justifyContent="center" gap="3" style={{marginTop: 16}}>
      <Button view="flat" disabled={page <= 1} href={buildHref(prevPage)}>Назад</Button>
      <Button view="flat" disabled={page >= totalPages} href={buildHref(nextPage)}>Вперед</Button>
    </Flex>
  );
}


