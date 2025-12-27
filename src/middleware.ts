import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/profile/:path*"],
};
