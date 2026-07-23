import React from "react";

function ConfirmModal({
  open,
  title = "Delete comment",
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div className='absolute inset-0 bg-black/55' onClick={onCancel} />
      <div className='relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg'>
        <h3 className='text-2xl font-bold text-grey-800'>{title}</h3>
        <p className='mt-3 text-[15px] leading-6 text-grey-500'>{message}</p>
        <div className='mt-5 flex justify-end gap-3'>
          <button
            onClick={onCancel}
            className='rounded-lg bg-grey-500 px-4 py-2 text-sm font-bold text-white transition hover:opacity-80'>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='rounded-lg bg-pink-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-200 hover:text-pink-400'>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
