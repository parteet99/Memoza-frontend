"use client";

import { CalendarDays, Mail, User, Hash, Camera } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import Avatar from "../ui/Avatar";
import UpdateProfile from "./UpdateProfile";
import { useState, useRef } from "react";
import Modal from "../ui/Modal";
import api from "@/lib/api";
import { notify } from "@/lib/notification";

export default function UserProfile({ user }) {
    const [editProfile, setEditProfile] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.user?.profile_image);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            notify.warning("Please select an image file.");
            return;
        }
        const maxSize = 5 * 1024 * 1024; //5mb

        if (file.size > maxSize) {
            notify.warning("Image size should not exceed 5 MB.");
            return;
        }

        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("image", file);

            const res = await api.post("/users/profile-image", formData);
            if (res?.data?.success) {
                notify.success(res?.data?.message || "Profile image updated.");
                setProfileImage(res?.data?.user?.profile_image);
            }
        } catch (err) {
            console.error(
                "Profile image upload error",
                err.response?.data || err,
            );
            notify.error(
                err?.response?.data?.message ||
                    "Failed to upload profile image.",
            );
        } finally {
            setUploadingImage(false);
            e.target.value = ""; //allow selecting same image again
        }
    };

    return (
        <div className="min-h-full p-6">
            <div className="max-w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Profile
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        View and manage your account information.
                    </p>
                </div>
                {/* Profile Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    {/* Profile Header */}
                    <div className="mb-6 flex flex-col items-center border-b border-gray-200 pb-6 dark:border-gray-800">
                        <div className="relative">
                            <Avatar
                                src={getImageUrl(profileImage)}
                                name={user?.user?.name}
                                size={112}
                            />
                            <button
                                type="button"
                                onClick={handleImageClick}
                                disabled={uploadingImage}
                                title="Change profile image"
                                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <Camera size={17} />
                            </button>
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        {uploadingImage && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Uploading image...
                            </p>
                        )}
                        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                            {user?.user?.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {user?.user?.email}
                        </p>
                    </div>

                    {/* Account Information */}
                    <div className="mb-6 flex items-center gap-3">    
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                            <User
                                size={20}
                                className="text-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white">   
                                Account information
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Your basic account details.
                            </p>
                        </div>
                    </div>
                    {/* Information */}
                    <div className="space-y-4">
                        {/* User ID */}
                        <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Hash
                                    size={20}
                                    className="text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">   
                                    User ID
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.user?.id || "-"}
                                </p>
                            </div>
                        </div>
                        {/* Full Name */}
                        <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <User
                                    size={20}
                                    className="text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">   
                                    Full Name
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.user?.name || "-"}
                                </p>
                            </div>
                        </div>
                        {/* Email */}
                        <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Mail
                                    size={20}
                                    className="text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">   
                                    Email Address
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.user?.email || "-"}
                                </p>
                            </div>
                        </div>
                        {/* Created At */}
                        <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <CalendarDays
                                    size={20}
                                    className="text-gray-700 dark:text-gray-300"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">   
                                    Account Created
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.user?.created_at
                                        ? new Date(
                                              user.user.created_at,
                                          ).toLocaleString()
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Edit Button */}
                    <div className="mt-6 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setEditProfile(true)}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 cursor-pointer"
                        >
                            Edit profile
                        </button>
                    </div>
                </div>
            </div>
            {/* Edit Profile Modal */}
            <Modal
                open={editProfile}
                onClose={() => setEditProfile(false)}
                title="Update Profile"
            >
                <UpdateProfile
                    user={user.user}
                    onClose={() => setEditProfile(false)}
                    onSave={(data) => {
                        console.log("Profile data:", data);
                    }}
                />
            </Modal>
        </div>
    );
}
