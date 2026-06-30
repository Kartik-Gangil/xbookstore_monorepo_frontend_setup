// src/pages/dashboard/InvoicePage.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, Paper, Grid, Divider, Breadcrumbs, Link as MuiLink, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../context/useAuth';

// Mock data for a specific invoice, matching the design
const mockInvoiceData = {
    id: 'IN-001',
    orderNumber: 'OD11235813',
    invoiceDate: '29/01/2025',
    dueDate: '26/04/2025',
    billTo: 'Kavindra Mannan\n27, Dlf City, Gupta\nDelhi, Delhi 40003',
    shipTo: 'Kavindra Mannan\n264, Abdul Rehman\nMumbai, Bihar 40009',
    items: [
        { id: 1, description: 'The Silent Observer (Paperback)', qty: 2, unitPrice: 599.00 },
        { id: 2, description: 'Custom Icon Package', qty: 1, unitPrice: 975.00 },
        { id: 3, description: 'Echoes of Eternity (Hardcover)', qty: 3, unitPrice: 999.00 },
    ],
    subtotal: 12246.00,
    gst: 1469.52,
    total: 13715.52,
};


function InvoicePage() {
    const { orderId } = useParams();
    const { order } = useAuth();
    const invoice = mockInvoiceData;
    // const invoice = order?.find((o) => String(o.id) === String(orderId)); // In a real app, you'd fetch this by orderId
    return (
        <Box>
            <Breadcrumbs sx={{ mb: 2 }}>
                <MuiLink component={Link} to="/dashboard/orders">Your Orders</MuiLink>
                <MuiLink component={Link} to={`/dashboard/orders/${invoice.orderNumber}`}>Order Details</MuiLink>
                <Typography color="text.primary">Invoice</Typography>
            </Breadcrumbs>

            <Paper variant="outlined" sx={{ p: 4, backgroundColor: 'background.paper' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Xoffencer Design</Typography>
                        <Typography color="text.secondary">77 Namrata Bldg</Typography>
                        <Typography color="text.secondary">Delhi, Delhi 400077</Typography>
                    </Box>
                    {/* You could add a logo here if you wish */}
                </Box>

                {/* Bill To / Ship To / Invoice Details */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Bill To</Typography><Typography sx={{ whiteSpace: 'pre-line' }}>{invoice.billTo}</Typography></Grid>
                    <Grid size={{ xs: 6, sm: 3 }}><Typography variant="body2" color="text.secondary">Ship To</Typography><Typography sx={{ whiteSpace: 'pre-line' }}>{invoice.shipTo}</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Grid container>
                            <Grid size={6}><Typography sx={{ fontWeight: 'bold' }}>Invoice #</Typography></Grid><Grid size={6}><Typography>{invoice.id}</Typography></Grid>
                            <Grid size={6}><Typography sx={{ fontWeight: 'bold' }}>Invoice Date</Typography></Grid><Grid size={6}><Typography>{invoice.invoiceDate}</Typography></Grid>
                            <Grid size={6}><Typography sx={{ fontWeight: 'bold' }}>Due Date</Typography></Grid><Grid size={6}><Typography>{invoice.dueDate}</Typography></Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Items Table */}
                <TableContainer sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: 'none', color: 'text.secondary' } }}>
                                <TableCell>Qty</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Unit Price</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice.items.map((item) => (
                                <TableRow key={item.id} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell align="right">₹{item.unitPrice.toFixed(2)}</TableCell>
                                    <TableCell align="right">₹{(item.qty * item.unitPrice).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Totals */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Box sx={{ width: '250px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Subtotal</Typography><Typography>₹{invoice.subtotal.toFixed(2)}</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">GST 12.0%</Typography><Typography>₹{invoice.gst.toFixed(2)}</Typography></Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tax Invoice Total</Typography><Typography variant="h6" sx={{ fontWeight: 'bold' }}>₹{invoice.total.toFixed(2)}</Typography></Box>
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Terms & Conditions</Typography>
                    <Typography variant="body2" color="text.secondary">Payment is due within 15 days</Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default InvoicePage;