
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    UserIcon,
    ShoppingBagIcon,
    HeartIcon,
    TicketIcon,
    QuestionMarkCircleIcon,
    MapPinIcon,
    CreditCardIcon,
    BellIcon,
    StarIcon,
    DocumentTextIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { UserIcon as UserIconSolid } from '@heroicons/react/24/solid';

const UserMenu = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleClick = () => {
        if (!user) {
            router.push('/login');
        }
    };

    if (!user) {
        return (
            <button
                onClick={handleClick}
                className="text-white hover:text-silver focus:outline-none"
                aria-label="Login"
            >
                <UserIcon className="h-6 w-6" />
            </button>
        );
    }

    // Helper to get display name
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'My Account';

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 text-white hover:text-silver focus:outline-none">
                <span className="sr-only">Open user menu</span>
                {/* Use Avatar if available, else Icon */}
                <div className="bg-gray-800 rounded-full p-1">
                    <UserIconSolid className="h-5 w-5 text-gray-400" />
                </div>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-black border border-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-gray-800">

                    {/* Header */}
                    <div className="px-4 py-3">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{displayName}</p>
                    </div>

                    {/* Group 1: Essentials */}
                    <div className="py-1">
                        <MenuItem href="/account/orders" icon={ShoppingBagIcon} label="My Orders" />
                        <MenuItem href="/wishlist" icon={HeartIcon} label="Wishlist" />
                        <MenuItem href="/account/coupons" icon={TicketIcon} label="Coupons" />
                        <MenuItem href="/help" icon={QuestionMarkCircleIcon} label="Help Center" />
                    </div>

                    {/* Group 2: Account Settings */}
                    <div className="py-1">
                        <MenuItem href="/account" icon={UserIcon} label="Profile Settings" />
                        <MenuItem href="/account/addresses" icon={MapPinIcon} label="Addresses" />
                        <MenuItem href="/account/cards" icon={CreditCardIcon} label="Saved Cards" />
                        <MenuItem href="/account/notifications" icon={BellIcon} label="Notifications" />
                    </div>

                    {/* Group 3: My Activity */}
                    <div className="py-1">
                        <MenuItem href="/account/reviews" icon={StarIcon} label="My Reviews" />
                    </div>

                    {/* Group 4: Info */}
                    <div className="py-1">
                        <MenuItem href="/terms" icon={DocumentTextIcon} label="Terms & Conditions" />
                    </div>

                    {/* Footer: Logout */}
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleLogout}
                                    className={`${active ? 'bg-red-900/20 text-red-500' : 'text-red-600'
                                        } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                                    Sign out
                                </button>
                            )}
                        </Menu.Item>
                    </div>

                </Menu.Items>
            </Transition>
        </Menu>
    );
};

const MenuItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <Menu.Item>
        {({ active }) => (
            <Link
                href={href}
                className={`${active ? 'bg-gray-800 text-white' : 'text-gray-300'
                    } group flex w-full items-center px-4 py-2 text-sm`}
            >
                <Icon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-silver" aria-hidden="true" />
                {label}
            </Link>
        )}
    </Menu.Item>
);

export default UserMenu;
