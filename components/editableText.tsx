'use client';
import { updateCv, UpdateSectionAction } from "@/redux/slices/cv";
import CheckIcon from '@mui/icons-material/Check';
import { TextField, Typography, TypographyProps } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export type EditableTextExtraProps = {
    text?: string;
    editable?: boolean;
    query: UpdateSectionAction["payload"]["query"];
};

export type EditableTextProps = EditableTextExtraProps & TypographyProps

export function EditableText({ query, text, editable, ...typographyProps }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const dispatch = useDispatch();

    const handleStartEdit = () => {
        if (editable) {
            setEditValue(text || "");
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        if (editable) {
            setIsEditing(false);
            dispatch(updateCv({ query, newValue: editValue }));
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditValue("");
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSave();
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            handleCancel();
        }
    };

    return isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                sx={{ width: "100%" }}
                multiline
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <IconButton onClick={handleSave}>
                <CheckIcon />
            </IconButton>
        </div>
    ) : (
            <Typography {...typographyProps} onClick={handleStartEdit}>{text}</Typography>
    );
}