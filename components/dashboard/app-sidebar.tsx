"use client";

import { LinkIcon, LogOut, UserCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
} from "../ui/sidebar";
import { DASHBOARD_NAVIGATION } from "@/constants";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { LogoIcon } from "../icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const AppSidebar = () => {
  const { data: session } = authClient.useSession();

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Button
                variant="ghost"
                className="justify-start group-data-[collapsible=icon]:justify-center"
              >
                <LogoIcon className="size-4" />
                <span className="truncate text-base font-semibold group-data-[collapsible=icon]:hidden">
                  Zipply
                </span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-primary text-primary-foreground font-medium"
                  tooltip="Create Link"
                >
                  <Link href="/dashboard/links/create">
                    <LinkIcon className="size-4" />
                    <span>Create New</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {DASHBOARD_NAVIGATION.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.tags?.length ? (
                        <div className="ml-auto group-data-[collapsible=icon]:hidden">
                          {item.tags.map(({ title, variant }) => (
                            <Badge key={title} variant={variant}>
                              {title}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip="Account">
                  <Avatar>
                    <AvatarImage
                      src={session?.user?.image || "/user-avatar.png"}
                    />
                    <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex w-full flex-col">
                    <span className="truncate font-medium">
                      {session?.user?.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {session?.user?.email}
                    </span>
                  </div>

                  <IconDotsVertical />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <UserCircle />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
