'use client';
import { updateCv, UpdateSectionAction } from "@/redux/slices/cv";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Typography, TypographyProps } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export type EditableTextExtraProps = {
    text?: string;
    editable?: boolean;
    query: UpdateSectionAction["payload"]["query"];
    onEditStart?: () => void;
    onEditEnd?: () => void;
};

export type EditableTextProps = EditableTextExtraProps & TypographyProps

export function EditableText({ query, text, editable, onEditStart, onEditEnd, ...typographyProps }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const dispatch = useDispatch();

    const handleStartEdit = () => {
        if (editable) {
            setEditValue(text || "");
            setIsEditing(true);
            onEditStart?.();
        }
    };

    const handleSave = () => {
        if (editable) {
            setIsEditing(false);
            dispatch(updateCv({ query, newValue: editValue }));
            onEditEnd?.();
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditValue("");
        onEditEnd?.();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TextField
                sx={{ width: "100%" }}
                multiline
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <IconButton onClick={handleSave} className="save-button" color="primary" size="small">
                <CheckIcon />
            </IconButton>
            <IconButton onClick={handleCancel} className="cancel-button" color="secondary" size="small">
                <CloseIcon />
            </IconButton>
        </div>
    ) : (
            <Typography {...typographyProps} onClick={handleStartEdit}>{text}</Typography>
    );
}