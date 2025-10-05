// "use client";
// import React from "react";
// import { useRef, useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// type Props = {
//   title: string;
//   onClose: () => void;
//   onOk: () => void;
//   children: React.ReactNode;
// };

// export default function Dialog({ title, onClose, onOk, children }: Props) {
//     const searchParams = useSearchParams()
//     const dialogRef = useRef<null | HTMLDialogElement>(null)
//     const showDialog = searchParams.get('showDialog')
//     useEffect(() => {
//         if (showDialog === 'y'){
//             dialogRef.current?.showModal()
//         } else{
//             dialogRef.current?.close()
//         }
//     }, [showDialog])
//     const closeDialog = () => {
//         dialogRef.current?.close()
//         onClose()
//     }
//     const clickOk = () => {
//         onOk()
//         closeDialog()
//     }
//     const dialog: JSX.Element | null = showDialog === 'y'?(
//         <dialog ref={dialogRef}></dialog>
//     ): null
//     return dialog
// }
