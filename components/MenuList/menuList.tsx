"use client";
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
import { IconType } from 'react-icons';

interface MenuListProps {
  linkTo: string[];
  linkName: string[];
  text: React.ReactNode;
  onSignOut?: () => void;
}

const MenuList = ({ linkTo, linkName, text, onSignOut }: MenuListProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let menuItems = linkTo.map((link, index) => (
        <div key={index}>
            {link === "signout" ? (
                <button 
                    onClick={onSignOut}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                    {linkName[index]}
                </button>
            ) : (
                <Link href={link}>
                    <div className="px-4 py-2 hover:bg-gray-100">
                        {linkName[index]}
                    </div>
                </Link>
            )}
        </div>
    ));
    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {text}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems}
            </Menu>
        </div>
    );
}
export default MenuList;