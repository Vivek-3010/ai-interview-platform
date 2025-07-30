"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteConfirmDialog({ onConfirm, triggerLabel = "Delete", triggerComponent }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        {triggerComponent || (
          <Button className="cursor-pointer" variant="destructive">
            <Trash2 className="w-4 h-4 mr-1 text-red-400" /> {/* Added text-red-400 here */}
            {triggerLabel}
          </Button>
        )}
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/70 backdrop-blur-sm fixed inset-0 z-50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertDialog.Content className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 p-6 shadow-xl space-y-4">
            <AlertDialog.Title className="text-xl font-semibold text-red-400">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete Interview
              </div>
            </AlertDialog.Title>
            <AlertDialog.Description className="text-gray-300">
              Are you sure you want to delete this interview? This action cannot be undone.
            </AlertDialog.Description>

            <div className="flex justify-end gap-3 pt-4">
              <AlertDialog.Cancel asChild>
                <Button 
                  className="hover:bg-gray-300 bg-gray-400 cursor-pointer border-gray-600 text-black" 
                  variant="outline"
                >
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button 
                  className="hover:bg-red-500 cursor-pointer bg-red-600 border-red-400" 
                  variant="destructive" 
                  onClick={onConfirm}
                >
                  Delete
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </motion.div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}