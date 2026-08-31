"use client"

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
    }


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
            console.error("Profile image upload error", err.response?.data || err);
            notify.error(err?.response?.data?.message || "Failed to upload profile image.");
        } finally {
            setUploadingImage(false);
            e.target.value = ""; //allow selecting same image again
        }

    }

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto max-w-6xl">
                {/* header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">My Profile</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View and manage your account information
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col items-center border-b pb-6">
                        <div className="relative">
                            <Avatar
                                src={getImageUrl(profileImage)}
                                name={user.user?.name}
                                size={112}
                            />

                            <button
                                type="button"
                                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center bg-white text-black border border-gray-300 justify-center rounded-full"
                                disabled={uploadingImage}
                                title="Change profile image"
                                onClick={handleImageClick}
                            >
                                <Camera size={17} />
                            </button>

                            <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
                        </div>
                        {uploadingImage && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Uploading image...
                            </p>
                        )}

                        <h2 className="mt-4 text-xl font-semibold">{user.user?.name}</h2>
                        <h2 className="mt-1 text-sm text-muted-foreground">{user.user?.email}</h2>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-4 rounded-xl border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Hash size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    User ID
                                </p>
                                <p className="text-sm font-medium">
                                    {user.user?.id || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <User size={20} />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Full Name
                                </p>

                                <p className="text-sm font-medium">
                                    {user.user?.name || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Mail className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Email Address
                                </p>

                                <p className="text-sm font-medium">
                                    {user.user?.email || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Account Created
                                </p>

                                <p className="text-sm font-medium">
                                    {user.user?.created_at && new Date(user.user.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            className="rounded-lg px-5 py-2.5 text-sm font-medium text-primary-foreground border cursor-pointer transition hover:opacity-50"
                            onClick={() => setEditProfile(true)}
                        >
                            Edit profile
                        </button>
                    </div>

                </div>
            </div>

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
                        // Later:
                        // await api.put(`/users/${user.user.id}`, data);
                    }}
                />
            </Modal>
        </div>
    )
}