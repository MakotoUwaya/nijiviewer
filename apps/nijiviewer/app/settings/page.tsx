'use client';

import { Bars3Icon, KeyIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { Reorder } from 'motion/react';
import { type JSX, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import type { PasskeyInfo } from '@/context/auth-context';
import {
  getPasskeyErrorMessage,
  isWebAuthnSupported,
} from '@/lib/passkey-utils';
import { usePreferences } from '@/context/preferences-context';

export default function SettingsPage(): JSX.Element {
  const {
    user,
    isLoading: isAuthLoading,
    listPasskeys,
    registerPasskey,
    updatePasskey,
    deletePasskey,
  } = useAuth();
  const {
    organizations,
    favoriteOrgIds,
    isLoading: isPrefLoading,
    toggleFavorite,
    initializeFavorites,
    updateOrder,
  } = usePreferences();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const deleteConfirmModal = useDisclosure();
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [passkeysLoading, setPasskeysLoading] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [editingPasskeyId, setEditingPasskeyId] = useState<string | null>(null);
  const [newFriendlyName, setNewFriendlyName] = useState('');
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(
    null,
  );
  const [isPasskeyAvailable, setIsPasskeyAvailable] = useState(false);

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

  useEffect(() => {
    setIsPasskeyAvailable(isWebAuthnSupported());
  }, []);

  useEffect(() => {
    const loadPasskeys = async () => {
      if (!user || !isPasskeyAvailable) return;
      setPasskeysLoading(true);
      setPasskeyError(null);
      try {
        const result = await listPasskeys();
        setPasskeys(result);
      } catch (err) {
        setPasskeyError(getPasskeyErrorMessage(err));
      } finally {
        setPasskeysLoading(false);
      }
    };
    loadPasskeys();
  }, [user, isPasskeyAvailable, listPasskeys]);

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

  const handleRegisterPasskey = async () => {
    setPasskeyError(null);
    setPasskeysLoading(true);
    try {
      await registerPasskey();
      const result = await listPasskeys();
      setPasskeys(result);
    } catch (err) {
      setPasskeyError(getPasskeyErrorMessage(err));
    } finally {
      setPasskeysLoading(false);
    }
  };

  const handleUpdatePasskey = async (passkeyId: string) => {
    setPasskeyError(null);
    try {
      await updatePasskey(passkeyId, newFriendlyName);
      const result = await listPasskeys();
      setPasskeys(result);
      setEditingPasskeyId(null);
      setNewFriendlyName('');
    } catch (err) {
      setPasskeyError(getPasskeyErrorMessage(err));
    }
  };

  const handleDeleteClick = (passkeyId: string) => {
    setDeletingPasskeyId(passkeyId);
    deleteConfirmModal.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPasskeyId) return;

    setPasskeyError(null);
    setPasskeysLoading(true);
    try {
      await deletePasskey(deletingPasskeyId);
      const result = await listPasskeys();
      setPasskeys(result);
      deleteConfirmModal.onClose();
      setDeletingPasskeyId(null);
    } catch (err) {
      setPasskeyError(getPasskeyErrorMessage(err));
    } finally {
      setPasskeysLoading(false);
    }
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
    <div className="container mx-auto max-w-2xl px-4 py-8 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-8">
        {/* Passkey Management */}
        {isPasskeyAvailable ? (
          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <KeyIcon className="h-5 w-5" />
              Passkeys
            </h2>
            <p className="text-small text-default-500 mb-4">
              Manage your passkeys for secure, passwordless authentication.
            </p>

            {passkeyError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {passkeyError}
              </div>
            )}

            <div className="mb-4">
              <Button
                color="primary"
                onPress={handleRegisterPasskey}
                isDisabled={passkeysLoading}
                isLoading={passkeysLoading}
                startContent={
                  !passkeysLoading && <KeyIcon className="h-4 w-4" />
                }
              >
                Register New Passkey
              </Button>
            </div>

            {passkeysLoading && passkeys.length === 0 ? (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            ) : passkeys.length === 0 ? (
              <Card>
                <CardBody className="text-center py-6 text-default-500">
                  No passkeys registered yet. Click "Register New Passkey" to
                  get started.
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-2">
                {passkeys.map((passkey) => (
                  <Card key={passkey.id} className="overflow-hidden w-full">
                    <CardBody className="p-4">
                      {editingPasskeyId === passkey.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newFriendlyName}
                            onChange={(e) => setNewFriendlyName(e.target.value)}
                            placeholder="Enter a name for this passkey"
                            size="sm"
                          />
                          <Button
                            size="sm"
                            color="primary"
                            onPress={() => handleUpdatePasskey(passkey.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => {
                              setEditingPasskeyId(null);
                              setNewFriendlyName('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {passkey.friendly_name || 'Unnamed Passkey'}
                            </div>
                            <div className="text-small text-default-500">
                              Created:{' '}
                              {new Date(
                                passkey.created_at,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => {
                                setEditingPasskeyId(passkey.id);
                                setNewFriendlyName(passkey.friendly_name || '');
                              }}
                            >
                              Rename
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onPress={() => handleDeleteClick(passkey.id)}
                              isDisabled={passkeysLoading}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <KeyIcon className="h-5 w-5" />
              Passkeys
            </h2>
            <Card>
              <CardBody className="text-center py-6">
                <p className="text-default-500 mb-2">
                  Your browser does not support Passkeys.
                </p>
                <p className="text-small text-default-400">
                  Please use a modern browser like Chrome, Edge, Safari, or
                  Firefox to use Passkeys.
                </p>
              </CardBody>
            </Card>
          </section>
        )}

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

      <Modal
        isOpen={deleteConfirmModal.isOpen}
        onOpenChange={deleteConfirmModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Passkey
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this Passkey? This action
                  cannot be undone.
                </p>
                <p className="text-small text-default-500 mt-2">
                  You will need to register a new Passkey if you want to use
                  passwordless sign-in again.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={() => {
                    onClose();
                    setDeletingPasskeyId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteConfirm}
                  isLoading={passkeysLoading}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
