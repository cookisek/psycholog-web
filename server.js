const express = require('express');
const path = express('path'); // alebo len const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pamäť pre rezervácie (keď vypneš server, všetko sa vymaže)
let reservations = [];

// Odoslanie hlavnej stránki
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint na vrátenie obsadených časov pre daný dátum
app.get('/api/booked-times', (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ message: 'Chýba dátum!' });
    }
    
    const bookedTimes = reservations
        .filter(r => r.date === date)
        .map(r => r.timeSlot);

    res.json(bookedTimes);
});

// Endpoint pre pridanie novej rezervácie iba do pamäte
app.post('/api/reservations', (req, res) => {
    const { name, email, phone, service, date, timeSlot, note } = req.body;

    if (!name || !date || !timeSlot) {
        return res.status(400).json({ message: 'Vyplňte povinné polia!' });
    }

    // Kontrola duplicity v pamäti
    const isTaken = reservations.some(r => r.date === date && r.timeSlot === timeSlot);
    if (isTaken) {
        return res.status(400).json({ message: 'Tento termín (dátum a čas) je už obsadený, vyberte si prosím iný!' });
    }

    const newReservation = { 
        id: Date.now(), 
        name, 
        email, 
        phone, 
        service, 
        date, 
        timeSlot, 
        note 
    };
    
    reservations.push(newReservation);

    return res.status(201).json({ message: 'Rezervácia bola úspešne vytvorená!' });
});

app.listen(PORT, () => {
    console.log(`Server beží! Otvorte v prehliadači: http://localhost:${PORT}`);
});