/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Place {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  category: "Heritage" | "Nature" | "Religious" | "Adventure" | string;
  rating: number;
  bestTime: string;
  entryFee: string;
  timings: string;
  desc: string;
  image: string;
  nearby: string[];
  stateName?: string;
  state?: StateData;
}

export interface StateData {
  id: string;
  name: string;
  capital: string;
  region: "North" | "South" | "East" | "West" | "Central" | "Northeast" | "Island" | string;
  tagline: string;
  color: string;
  image: string;
  places: Place[];
}

export interface IndiaData {
  states: StateData[];
}
