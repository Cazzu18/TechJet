const express = require('express');
const stripe = require('stripe')('sk_test_51LkvujEYRRBsdae4KGIXMsCpMeCNbmcjTiCON5ynkecDbHWbk4JOYILuSe7FHDodNVL1SQ198QEPhB02THAmUQOr00362iomjQ');
const router = express.Router();

// Route to create a Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Cart Total',
                        },
                        unit_amount: 34300, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html', // Adjust for your success page
            cancel_url: 'http://localhost:3000/cancel.html',   // Adjust for your cancel page
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;