'use client';
import { updateCv, UpdateSectionAction } from "@/redux/slices/cv";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { TextField, Typography, TypographyProps, Box } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DiffText } from "@/components/ui/DiffText";

export type EditableTextExtraProps = {
    text?: string;
    editable?: boolean;
    query: UpdateSectionAction["payload"]["query"];
    onEditStart?: () => void;
    onEditEnd?: () => void;
    originalText?: string;
    showDiff?: boolean;
    onDelete?: () => void;
    onRestore?: () => void;
    autoEdit?: boolean;
    onAutoDelete?: () => void;
};

export type EditableTextProps = EditableTextExtraProps & TypographyProps

export function EditableText({ query, text, editable, onEditStart, onEditEnd, originalText, showDiff = false, onDelete, onRestore, autoEdit = false, onAutoDelete, ...typographyProps }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [isNarrowContainer, setIsNarrowContainer] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    // Auto-start editing for new empty items
    useEffect(() => {
        if (autoEdit && editable && (!text || text.trim() === "") && !isEditing) {
            setEditValue(text || "");
            setIsEditing(true);
            onEditStart?.();
        }
    }, [autoEdit, editable, text, isEditing, onEditStart]);

    // Check container width when entering edit mode
    useEffect(() => {
        if (isEditing && containerRef.current) {
            const checkWidth = () => {
                if (containerRef.current) {
                    const width = containerRef.current.offsetWidth;
                    // If container is less than 400px, stack buttons vertically
                    setIsNarrowContainer(width < 400);
                }
            };

            checkWidth();

            // Add resize listener
            const resizeObserver = new ResizeObserver(checkWidth);
            resizeObserver.observe(containerRef.current);

            return () => resizeObserver.disconnect();
        }
    }, [isEditing]);

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
            // If saving empty content and onAutoDelete is provided, delete the item
            if ((!editValue || editValue.trim() === "") && onAutoDelete) {
                onAutoDelete();
            } else {
                dispatch(updateCv({ query, newValue: editValue }));
            }
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


    if (isEditing) {
        return (
            <Box ref={containerRef} display="flex" alignItems="flex-start" gap={1}>
                <TextField
                    sx={{ flex: 1 }}
                    multiline
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Box
                    display="flex"
                    flexDirection={isNarrowContainer ? 'column' : 'row'}
                    gap={isNarrowContainer ? 0.5 : 1}
                >
                    <IconButton onClick={handleSave} className="save-button" color="primary" size="small">
                        <CheckIcon />
                    </IconButton>

                    {/* For new empty items (autoEdit), only show delete button, no cancel */}
                    {autoEdit && (!text || text.trim() === "") ? (
                        <IconButton
                            onClick={() => {
                                setIsEditing(false);
                                if (onAutoDelete) {
                                    onAutoDelete();
                                }
                            }}
                            className="delete-button"
                            color="error"
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    ) : (
                        <>
                            <IconButton onClick={handleCancel} className="cancel-button" color="secondary" size="small">
                                <CloseIcon />
                            </IconButton>
                            {onDelete && (
                                <IconButton
                                    onClick={() => {
                                        setIsEditing(false);
                                        onDelete();
                                    }}
                                    className="delete-button"
                                    color="error"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                            {onRestore && (
                                <IconButton
                                    onClick={() => {
                                        setIsEditing(false);
                                        onRestore();
                                    }}
                                    className="restore-button"
                                    color="info"
                                    size="small"
                                    title="Revert to original"
                                >
                                    <RestoreIcon />
                                </IconButton>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        );
    } else if (showDiff && originalText !== undefined && originalText !== text) {
        // Check if this is a deleted item (empty current text but has original text)
        const isDeleted = (!text || text.trim() === "") && originalText && originalText.trim() !== "";

        if (isDeleted && onRestore && editable) {
            // For deleted items, show original text with strikethrough and a restore button
            return (
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography {...typographyProps} sx={{ flex: 1 }}>
                        <DiffText original={originalText} current={text} {...typographyProps} />
                    </Typography>
                    <IconButton
                        onClick={onRestore}
                        color="success"
                        size="small"
                        sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                    >
                        <RestoreIcon />
                    </IconButton>
                </Box>
            );
        }

        return (
            <Typography {...typographyProps} onClick={handleStartEdit}>
                <DiffText original={originalText} current={text} {...typographyProps} />
            </Typography>
        );
    } else {
        return (
            <Typography {...typographyProps} onClick={handleStartEdit}>
                {text}
            </Typography>
        );
    }
}