import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

const DeleteFileDialog = ({ file, onClose, onDelete, isButton }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {isButton ? <Button
                    size="sm"
                    variant="destructive"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button> : <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-white hover:bg-red-500/80"

                >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure ?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to permanently delete {file.name} file from s3 ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            onDelete(file.id);
                            onClose && onClose();
                        }}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteFileDialog