import { Request, Response } from 'express';
import { Reservation } from '../types/index.js';
import { saveData, loadData } from '../utils/storage.js';

const reservations: Reservation[] = loadData('reservations', []);

export const createReservation = (req: Request, res: Response) => {
  const reservation: Reservation = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  reservations.push(reservation);
  saveData('reservations', reservations);
  res.status(201).json(reservation);
};

export const getReservations = (req: Request, res: Response) => {
  res.json(reservations);
};

export const updateReservationStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const reservation = reservations.find(r => r.id === id);
  if (reservation) {
    reservation.status = status;
    saveData('reservations', reservations);
    res.json(reservation);
  } else {
    res.status(404).json({ error: 'Reservation not found' });
  }
};
