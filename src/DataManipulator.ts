import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number, 
  trigger_alert: number | undefined,
  // Returning ratio when trigger, otherwise keeping it undefined
  // This will show proper dips or rises on the graph
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row[] {
    // Price is the avg of top ask price and top bid price
    const priceABC = (serverRespond[0].top_ask_price + serverRespond[0].top_bid_price) / 2;
    const priceDEF = (serverRespond[1].top_ask_price + serverRespond[1].top_bid_price) / 2;
    const ratio = priceABC / priceDEF;
    // Setting a 5% limit for bounds
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
          serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,      
      };
  }
}
