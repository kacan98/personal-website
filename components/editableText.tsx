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
    const dispatch = useDispatch();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (editable) {
            setIsEditing(false)
            dispatch(updateCv({ query, newValue: inputRef.current?.value || "" }));
        }
    };

    return isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                sx={{ width: "100%" }}
                multiline
                type="text"
                defaultValue={text}
                onBlur={handleSave}
                inputRef={inputRef}
            />
            <IconButton onClick={handleSave}>
                <CheckIcon />
            </IconButton>
        </div>
    ) : (
        <Typography {...typographyProps} onClick={() => editable && setIsEditing(true)}>{text}</Typography>
    );
}