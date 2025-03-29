"use client";

import OrgSelector from "@/components/org-selector";
import { organizationMap } from "@/const/organizations";
import type { Organization } from "@/lib/holodex";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { type JSX, useEffect } from "react";

const getLeafSegmentName = (path: string): string => {
  if (path === "/") {
    return "";
  }
  return decodeURIComponent(path.split("/")[2]?.trim() || "");
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps): JSX.Element {
  const router = useRouter();
  const pathName = usePathname();
  const leafSegmentName = getLeafSegmentName(pathName);

  // ブレークポイントの監視
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = (e: MediaQueryListEvent) => {
      if (e.matches && isOpen) {
        onClose();
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [isOpen, onClose]);

  const onChangeOrganization = (organization: Organization) => {
    onClose();
    router.push(`/live-videos/${organization.id}`);
  };

  // モバイル用のモーダル表示
  return (
    <Modal
      backdrop="blur"
      className="md:hidden"
      hideCloseButton
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            x: 0,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            x: "-100%",
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
      onClose={onClose}
      placement="bottom-center"
    >
      <ModalContent className="h-full max-w-[280px]">
        <ModalHeader className="flex flex-col gap-1">Menu</ModalHeader>
        <ModalBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <OrgSelector
              items={organizationMap}
              selectedKey={leafSegmentName}
              onChange={onChangeOrganization}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
