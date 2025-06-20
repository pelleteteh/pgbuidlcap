import React from "react";
import { Card, CardBody, Avatar, Button, Tabs, Tab, Chip, Progress, Divider, Modal, ModalContent, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAccount, useEnsName, useEnsAvatar, useBalance } from 'wagmi';
import { useTheme } from "@heroui/use-theme";
import { getAvatarUrl, generateAvatar, saveAvatarSettings, AvatarCustomization } from '../utils/avatar-utils';

interface Badge {
  id: string;
  name: string;
  icon: string;
  type: 'builder' | 'dev' | 'team' | 'contributor';
  level: 'bronze' | 'silver' | 'gold' | 'diamond';
  description: string;
  unlockedAt: string;
}

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="flex items-center gap-2 p-2.5 sm:p-4 bg-default-50/50 backdrop-blur-sm rounded-xl border border-default-200/50 hover:bg-default-100/50 transition-all group">
    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
      <Icon icon={icon} className="text-primary w-4 h-4 sm:w-6 sm:h-6" />
    </div>
    <div className="min-w-0">
      <p className="text-xs sm:text-sm text-default-400 font-medium truncate">{label}</p>
      <p className="text-sm sm:text-lg font-bold tracking-tight mt-0.5">{value}</p>
    </div>
  </div>
);

interface EditModalState {
  isOpen: boolean;
  type: 'avatar' | 'profile' | null;
}

export const ProfilePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [editModal, setEditModal] = React.useState<EditModalState>({ isOpen: false, type: null });
  const [bio, setBio] = React.useState("Building public goods for web3 | Full-stack developer | Open source contributor");
  const [avatarSettings, setAvatarSettings] = React.useState<AvatarCustomization>({});
  
  const { address, isConnecting, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const { data: balance } = useBalance({ address });
  const { theme } = useTheme();

  // Handler for avatar customization
  const handleAvatarCustomize = () => {
    const newSettings: AvatarCustomization = {
      ...avatarSettings,
      seed: Math.random().toString(), // Generate new random avatar
    };
    setAvatarSettings(newSettings);
    if (address) {
      saveAvatarSettings(address, newSettings);
    }
  };

  // Handler for profile edit
  const handleProfileEdit = (newBio: string) => {
    setBio(newBio);
    setEditModal({ isOpen: false, type: null });
  };

  // If wallet is not connected, show connect prompt
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <Icon icon="lucide:wallet" className="w-16 h-16 text-default-300" />
        <h2 className="text-xl font-bold text-default-600">Connect Your Wallet</h2>
        <p className="text-default-400 text-center max-w-md">
          Connect your wallet to view your profile, contributions, and builder stats.
        </p>
      </div>
    );
  }

  // Loading state while fetching wallet data
  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="max-w-md"
        />
      </div>
    );
  }

  const displayName = ensName || address;
  const shortAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

  // Helper function to format the balance with appropriate decimal places
  const formatBalance = () => {
    if (!balance?.formatted) return '0.0000';
    const num = Number(balance.formatted);
    return num < 0.0001 ? '<0.0001' : num.toFixed(4);
  };

  // Example badges data (replace with actual data from your API/state)
  const badges: Badge[] = [
    { 
      id: '1', 
      name: 'Early Builder',
      icon: 'lucide:hammer',
      type: 'builder',
      level: 'gold',
      description: 'One of the first builders on the platform',
      unlockedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Code Contributor',
      icon: 'lucide:git-pull-request',
      type: 'dev',
      level: 'silver',
      description: 'Contributed to multiple open source projects',
      unlockedAt: '2024-02-01'
    }
  ];

  const getBadgeColor = (level: 'bronze' | 'silver' | 'gold' | 'diamond') => {
    switch (level) {
      case 'diamond': return {
        base: "bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow",
        content: "text-blue-700 font-medium",
        dot: "bg-gradient-to-r from-blue-400 to-blue-600",
        icon: "text-blue-600"
      };
      case 'gold': return {
        base: "bg-gradient-to-r from-yellow-50 via-amber-100 to-yellow-50 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow",
        content: "text-yellow-700 font-medium",
        dot: "bg-gradient-to-r from-yellow-400 to-amber-500",
        icon: "text-yellow-600"
      };
      case 'silver': return {
        base: "bg-gradient-to-r from-gray-50 via-slate-100 to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
        content: "text-gray-700 font-medium",
        dot: "bg-gradient-to-r from-gray-400 to-slate-500",
        icon: "text-gray-600"
      };
      default: return {
        base: "bg-gradient-to-r from-orange-50 via-amber-100 to-orange-50 border border-amber-200 shadow-sm hover:shadow-md transition-shadow",
        content: "text-amber-700 font-medium",
        dot: "bg-gradient-to-r from-amber-400 to-orange-500",
        icon: "text-amber-600"
      };
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 sm:pb-0 overflow-y-auto">
      {/* Profile Header */}
      <Card className="w-full mb-4 sm:mb-6 border-none shadow-lg rounded-2xl overflow-visible">
        <CardBody className="p-0">
          {/* Cover Image */}
          <div className="relative">
            <div className="h-32 sm:h-40 md:h-56 bg-gradient-to-br from-primary/30 via-primary/20 to-background/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-[url('/patterns/grid.png')] opacity-30 mix-blend-soft-light"></div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                isIconOnly
                className="bg-background/80 backdrop-blur-xl hover:bg-background shadow-lg transition-all"
                variant="flat"
                size="sm"
                onPress={() => window.navigator.clipboard.writeText(address || '')}
              >
                <Icon icon="lucide:copy" width={14} />
              </Button>
              <Button
                isIconOnly
                className="bg-background/80 backdrop-blur-xl hover:bg-background shadow-lg transition-all"
                variant="flat"
                size="sm"
                onPress={() => setEditModal({ isOpen: true, type: 'profile' })}
              >
                <Icon icon="lucide:edit" width={14} />
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-3 pb-4 sm:px-6 sm:pb-8">
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-6 relative">
              {/* Avatar */}
              <div className="relative -mt-16 sm:-mt-20 md:-mt-24">
                <Avatar
                  src={getAvatarUrl(ensAvatar, address || '', theme as 'light' | 'dark')}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 ring-4 ring-background shadow-xl"
                  alt={displayName}
                />
                <Button
                  isIconOnly
                  className="absolute bottom-0 right-0 bg-background shadow-lg"
                  variant="light"
                  size="sm"
                  onPress={() => setEditModal({ isOpen: true, type: 'avatar' })}
                >
                  <Icon icon="lucide:edit-3" width={14} />
                </Button>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{displayName}</h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <p className="text-sm text-default-400 font-medium">{shortAddress}</p>
                    <Button
                      isIconOnly
                      className="w-6 h-6 min-w-unit-6 bg-default-100/50"
                      variant="light"
                      size="sm"
                      onPress={() => navigator.clipboard.writeText(address || '')}
                    >
                      <Icon icon="lucide:copy" className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                  {/* Wallet Balance */}
                  <Chip
                    size="sm"
                    variant="dot"
                    classNames={{
                      base: "bg-success-50 border-success-500",
                      content: "text-success-600 text-small font-medium",
                      dot: "bg-success-500"
                    }}
                    startContent={
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:wallet" width={12} />
                        <span>
                          {formatBalance()} {balance?.symbol || 'ETH'}
                        </span>
                      </div>
                    }
                  />

                  {/* Active Badges */}
                  {badges.slice(0, 3).map((badge) => (
                    <Chip
                      key={badge.id}
                      size="sm"
                      variant="dot"
                      classNames={{
                        base: getBadgeColor(badge.level).base,
                        content: getBadgeColor(badge.level).content,
                        dot: getBadgeColor(badge.level).dot,
                      }}
                      startContent={
                        <div className="flex items-center gap-1">
                          <Icon icon={badge.icon} width={12} />
                          <span>{badge.name}</span>
                        </div>
                      }
                    />
                  ))}
                </div>

                {/* Bio */}
                <p className="text-sm text-default-500 max-w-2xl px-4 sm:px-0 leading-relaxed">
                  {bio}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-6">
                  <StatCard
                    label="Experience"
                    value="1,250"
                    icon="lucide:star"
                  />
                  <StatCard
                    label="Contributions"
                    value="28"
                    icon="lucide:git-merge"
                  />
                  <StatCard
                    label="Projects"
                    value="4"
                    icon="lucide:folder"
                  />
                  <StatCard
                    label="Reputation"
                    value="#125"
                    icon="lucide:award"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit Modals */}
      <Modal 
        isOpen={editModal.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditModal({ isOpen: false, type: null });
        }}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "border border-default-200 bg-background/80 backdrop-blur-xl dark:bg-default-100/50",
          header: "border-b border-default-200",
          body: "p-0",
          backdrop: "backdrop-blur-sm backdrop-saturate-150"
        }}
      >
        <ModalContent>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold tracking-tight">
                {editModal.type === 'avatar' ? 'Customize Avatar' : 'Edit Profile'}
              </h3>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setEditModal({ isOpen: false, type: null })}
              >
                <Icon icon="lucide:x" width={16} />
              </Button>
            </div>

            {editModal.type === 'avatar' ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Avatar
                    src={generateAvatar(address || '', theme as 'light' | 'dark', avatarSettings)}
                    className="w-32 h-32"
                    alt="Preview"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={handleAvatarCustomize}
                    startContent={<Icon icon="lucide:refresh-cw" width={16} />}
                  >
                    Generate New
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="light"
                onPress={() => setEditModal({ isOpen: false, type: null })}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (editModal.type === 'profile') {
                    handleProfileEdit(bio);
                  } else {
                    setEditModal({ isOpen: false, type: null });
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Tabs Navigation */}
      <Tabs 
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab as any}
        className="w-full"
        variant="underlined"
        size="lg"
      >
        <Tab
          key="overview"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:layout-dashboard" width={16} />
              <span>Overview</span>
            </div>
          }
        >
          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Active Projects */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
                <div className="space-y-4">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon icon="lucide:boxes" className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Project Name</h4>
                        <p className="text-sm text-default-400">Description of the project goes here</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Chip size="sm" variant="flat">Active</Chip>
                          <span className="text-xs text-default-400">Updated 2h ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <Icon icon="lucide:git-commit" className="text-success" width={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">Contributed</span> to Project Name
                        </p>
                        <span className="text-xs text-default-400">2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
        <Tab
          key="contributions"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:git-merge" width={16} />
              <span>Contributions</span>
            </div>
          }
        >
          {/* Contributions content */}
        </Tab>
        <Tab
          key="projects"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:folder" width={16} />
              <span>Projects</span>
            </div>
          }
        >
          {/* Projects content */}
        </Tab>
        <Tab
          key="badges"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:medal" width={16} />
              <span>Badges</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {badges.map((badge) => (
              <Card key={badge.id} className="border border-divider">
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBadgeColor(badge.level).base}`}>
                      <Icon icon={badge.icon} className={getBadgeColor(badge.level).content} width={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{badge.name}</h4>
                        <Chip
                          size="sm"
                          variant="flat"
                          classNames={{
                            base: getBadgeColor(badge.level).base,
                            content: getBadgeColor(badge.level).content
                          }}
                        >
                          {badge.level}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-400 mt-1">{badge.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Icon icon="lucide:clock" className="text-default-400" width={12} />
                        <span className="text-xs text-default-400">
                          Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
