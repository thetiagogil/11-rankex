import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    mode?: string;
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const authUrl = new URL("/auth", "https://rankex.local");

  if (params.mode) {
    authUrl.searchParams.set("mode", params.mode);
  }

  if (params.error) {
    authUrl.searchParams.set("error", params.error);
  }

  if (params.next) {
    authUrl.searchParams.set("next", params.next);
  }

  redirect(`${authUrl.pathname}${authUrl.search}`);
}
