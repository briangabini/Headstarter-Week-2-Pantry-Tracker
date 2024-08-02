'use client'
import Image from "next/image";
import { useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import { collection, query, getDocs, doc, getDoc, deleteDoc, setDoc} from "firebase/firestore";
import {DocumentReference} from "@firebase/firestore-types";


interface InventoryItem {
    name: string;
    quantity: number;
}

export default function Home() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState("");

   const updateInventory = async (): Promise<void> => {
       const snapshot = query(collection(firestore, "inventory"));
       const docs = await getDocs(snapshot);
       const inventoryList: InventoryItem[] = [];
       docs.forEach(doc => {
           const data = doc.data();
           inventoryList.push({
               name: doc.id,
               quantity: data.quantity
           });
       })
       console.log(inventoryList);
       setInventory(inventoryList);
   }

   const addItem = async (item: string): Promise<void> => {
    const docRef = doc(collection(firestore, "inventory"), item) as DocumentReference<{ quantity: number }>;
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
    } else {
       await setDoc(docRef, { quantity: 1 });
    }
}

   useEffect(() => {
       updateInventory();
   }, [])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box
            width={"100vw"}
            height={"100vh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
        >
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box
                    position="absolute"
                    top={"50%"}
                    left={"50%"}
                    width={400}
                    bgcolor={"white"}
                    border={"2px solid black"}
                    boxShadow={24}
                    p={4}
                    display={"flex"}
                    flexDirection="column"
                    gap={3}
                    sx={{
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    <Typography variant="h6">Add Item</Typography>
                    <Stack
                        width="100%"
                        direction="row"
                        spacing={2}
                    >
                       <TextField
                        variant="outlined"
                        fullWidth
                        value={itemName}
                        onChange={(e) => {
                            setItemName(e.target.value);
                        }}
                       ></TextField>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                addItem(itemName);
                                setItemName("");
                                handleClose();
                            }}
                        >
                            Add
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Typography variant="h1">
                Inventory Management
            </Typography>
        </Box>
    );
}
