'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { Reorder } from 'framer-motion';
import { type JSX, useEffect, useMemo } from 'react';

import { useAuth } from '@/context/auth-context';
import { usePreferences } from '@/context/preferences-context';

export default function SettingsPage(): JSX.Element {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    organizations,
    favoriteOrgIds,
    isLoading: isPrefLoading,
    toggleFavorite,
    initializeFavorites,
    updateOrder,
  } = usePreferences();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const initIfNeeded = async () => {
      if (user && !isPrefLoading && organizations.length > 0) {
        if (favoriteOrgIds.length === 0) {
          const allIds = organizations.map((o) => o.id);
          await initializeFavorites(allIds);
        }
      }
    };
    initIfNeeded();
  }, [user, isPrefLoading, organizations, favoriteOrgIds, initializeFavorites]);

  const enabledOrgs = useMemo(() => {
    return favoriteOrgIds
      .map((id) => organizations.find((o) => o.id === id))
      .filter((o): o is typeof o & {} => !!o);
  }, [favoriteOrgIds, organizations]);

  const disabledOrgs = useMemo(() => {
    return organizations.filter((o) => !favoriteOrgIds.includes(o.id));
  }, [organizations, favoriteOrgIds]);

  const handleReorder = (newOrder: string[]) => {
    updateOrder(newOrder);
  };

  const handleToggle = async (orgId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Checking constraint
      if (favoriteOrgIds.length <= 1) {
        onOpen();
        return;
      }
    }
    await toggleFavorite(orgId, isFavorite);
  };

  if (isAuthLoading || isPrefLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardBody className="text-center py-10">
            <p className="text-lg mb-4">
              You need to be signed in to manage settings.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-8">
        {/* Active Organizations (Reorderable) */}
        <section>
          <h2 className="text-lg font-bold mb-2">Favorite Organizations</h2>
          <p className="text-small text-default-500 mb-4">
            Drag to reorder. Uncheck to hide from sidebar.
          </p>

          <Reorder.Group
            axis="y"
            values={favoriteOrgIds}
            onReorder={handleReorder}
            className="space-y-2 w-full"
          >
            {enabledOrgs.map((org) => (
              <Reorder.Item key={org.id} value={org.id} className="w-full">
                <Card className="overflow-hidden w-full">
                  <CardBody className="flex flex-row items-center p-3 select-none overflow-hidden">
                    <Bars3Icon className="h-6 w-6 text-default-400 mr-3 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                    <div className="flex-1 font-medium truncate">
                      {org.name}
                    </div>
                    <Checkbox
                      isSelected={true}
                      onValueChange={() => handleToggle(org.id, false)}
                    />
                  </CardBody>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </section>

        {/* Inactive Organizations */}
        {disabledOrgs.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-2">Available Organizations</h2>
            <p className="text-small text-default-500 mb-4">
              Check to add to sidebar favorites.
            </p>
            <div className="space-y-2">
              {disabledOrgs.map((org) => (
                <Card key={org.id} className="overflow-hidden w-full">
                  <CardBody className="flex flex-row items-center p-3 overflow-hidden">
                    <div className="h-6 w-6 mr-3 flex-shrink-0" />{' '}
                    {/* Spacer for alignment */}
                    <div className="flex-1 text-default-600 truncate">
                      {org.name}
                    </div>
                    <Checkbox
                      isSelected={false}
                      onValueChange={() => handleToggle(org.id, true)}
                    />
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Selection Required
              </ModalHeader>
              <ModalBody>
                <p>You must select at least one organization.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
