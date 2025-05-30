import React from "react";
import { useTheme } from "@heroui/use-theme";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Input, Tabs, Tab, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TokenTable } from "./components/token-table";
import { Sidebar } from "./components/sidebar";
import { TimeFilter } from "./components/time-filter";
import { ThemeSwitcher } from "./components/theme-switcher";
import { MobileNavigation } from "./components/mobile-navigation";
import { MarketStats } from "./components/market-stats";
import { Routes } from "./components/routes";

export default function App() {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState("6H");
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <div className={theme === "dark" ? "dark" : "light"}>
      <div className="min-h-screen h-screen bg-background text-foreground flex flex-col">
        {/* Fixed Header */}
        <Navbar 
          maxWidth="full" 
          className="border-b border-divider compact-nav h-12 bg-background/70 backdrop-blur-md"
          isBordered
        >
          <NavbarContent className="gap-2">
            <NavbarBrand>
              <div className="flex items-center gap-2">
                <img src="/youbuidlsocialsvg.svg" alt="YouBuidl Logo" className="h-8 w-8" />
                <p className="font-bold text-inherit text-sm hidden sm:block">YouBuidl</p>
              </div>
            </NavbarBrand>

            <NavbarItem>
              <Input
                classNames={{
                  base: "max-w-full sm:max-w-[20rem]",
                  mainWrapper: "h-full",
                  input: "text-sm font-medium placeholder:text-default-400",
                  inputWrapper: "h-8 font-normal text-default-300 bg-default-100/60 border border-default-200 rounded-md hover:border-default-300 focus-within:border-primary focus-within:bg-background transition-all duration-200",
                }}
                placeholder="Search projects, rounds, or builders..."
                size="sm"
                radius="md"
                startContent={<Icon icon="lucide:search" className="text-default-400" width={16} height={16} />}
                type="search"
              />
            </NavbarItem>

            <NavbarItem>
              <div className="hidden md:flex gap-4">
                <Button
                  variant="light"
                  className="text-sm font-medium"
                  startContent={<Icon icon="lucide:compass" width={16} height={16} />}
                >
                  Explore
                </Button>
                <Button
                  variant="light"
                  className="text-sm font-medium"
                  startContent={<Icon icon="lucide:trending-up" width={16} height={16} />}
                >
                  Trending
                </Button>
              </div>
            </NavbarItem>
          </NavbarContent>
          
          <NavbarContent justify="end">
            <NavbarItem className="hidden md:flex">
              <ThemeSwitcher />
            </NavbarItem>
          
            <NavbarItem>
              <Button 
                color={isWalletConnected ? "success" : "primary"}
                variant="solid"
                className="hidden sm:flex compact-button"
                size="sm"
                onPress={handleConnectWallet}
              >
                {isWalletConnected ? (
                  <>
                    <Icon icon="lucide:check-circle" className="mr-1" width={14} height={14} />
                    <span className="truncate max-w-[80px]">0x1a2b...3c4d</span>
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
              <Button 
                isIconOnly 
                color={isWalletConnected ? "success" : "primary"}
                variant="solid"
                className="sm:hidden"
                size="sm"
                aria-label="Connect Wallet"
                onPress={handleConnectWallet}
              >
                <Icon icon={isWalletConnected ? "lucide:check-circle" : "lucide:wallet"} width={14} height={14} />
              </Button>
            </NavbarItem>
            <NavbarItem className="md:hidden">
              <Button 
                isIconOnly 
                variant="light" 
                onPress={() => setIsSidebarOpen(!isSidebarOpen)}
                size="sm"
                aria-label="Menu"
              >
                <Icon icon="lucide:menu" width={14} height={14} />
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        {/* Main Content Area with Fixed Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Fixed Sidebar */}
          {!isMobile && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 h-full flex flex-col">
              <Routes isWalletConnected={isWalletConnected} />
            </div>
          </main>
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && <MobileNavigation />}
      </div>
    </div>
  );
}