import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

const notificationIcon = (
    <div>
        <IoNotificationsOutline className="h-7 w-7 text-[#035fe9]" />
    </div>
);

interface Notification {
    notification_id: number;
    user_id: number;
    message: string;
    read: boolean;
    created_at: string;
    notification_type: number;
}

const Notification = () => {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const [allNotifications, setAllNotifications] = useState([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAll, setIsLoadingAll] = useState(false);

    const token = localStorage.getItem("jwt");

    const getUnreadNotifications = () => {
        setIsLoading(true);
        fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/notifications/Unread`,
            {
                mode: "cors",
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        )
            .then((response) => response.json())
            .then((response) => {
                setNotifications(() => response);
                setIsLoading(false);
            })
    }

    const markNotificationAsRead = (notificationId: number) => {

        fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/notifications/Markread`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notificationIds: [notificationId] })
        })
            .then((response) => response.json())
            .then(() => getUnreadNotifications())
    };

    const fetchAllNotifications = () => {
        setIsLoadingAll(true);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/notifications/All`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setAllNotifications(data);
                setIsLoadingAll(false);
            });
    };

    useEffect(() => {
        if (token) {
            getUnreadNotifications();
        }
    }, [token]);

    const unreadNotifications = notifications.filter(n => !n.read).length;

    const notificationTypes = {
        "patient_upcoming_appointment": 10,
        "doctor_pending_request": 20,
    }

    const handleNotificationClick = (notification: Notification) => {
        markNotificationAsRead(notification.notification_id);
        if (notification.notification_type === notificationTypes["patient_upcoming_appointment"]) {
            router.push('/patientProfile/upcoming_appointments');
        }
        if (notification.notification_type === notificationTypes["doctor_pending_request"]) {
            router.push('/doctorProfile/requests');
        }
        setShowNotifications(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-full"
            >
                {notificationIcon}
                {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadNotifications}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto
                    animate-fade-in animate-slide-in-top"
                >
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                                {showAllNotifications ? 'All Notifications' : 'Unread Notifications'}
                            </h3>
                            <button
                                onClick={() => {
                                    if (!showAllNotifications) {
                                        fetchAllNotifications();
                                    }
                                    setShowAllNotifications(!showAllNotifications);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {showAllNotifications ? 'Show Unread' : 'View All'}
                            </button>
                        </div>

                        {isLoading || (showAllNotifications && isLoadingAll) ? (
                            <div className="flex justify-center items-center p-4">
                                <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                            </div>
                        ) : (
                            < >
                                {!isLoading && (showAllNotifications ? allNotifications : notifications).length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No Notifications
                                    </div>
                                ) : (
                                    (showAllNotifications ? allNotifications : [...notifications])
                                        .filter(notification => showAllNotifications ? true : !notification.read)
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .map((notification) => (
                                            <div
                                                key={notification.notification_id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <p className="text-sm">{notification.message}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                )}
                            </ >
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;