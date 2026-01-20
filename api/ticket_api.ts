import axios from 'axios';
import { Ticket, TicketCheckInResponse, TicketApiResponse } from '../type/Tickets.type';
const BASE_URL = 'https://api.momangshow.vn/api/';
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TicketApi = {
  getTicketDetail: async (ticketCode: string): Promise<TicketApiResponse<Ticket>> => {
    const response = await axiosClient.get<TicketApiResponse<Ticket>>(`${BASE_URL}/${ticketCode}`);
    return response.data;
  },
  scanTicket: async (ticketCode: string): Promise<TicketApiResponse<TicketCheckInResponse>> => {
    const response = await axiosClient.post<TicketApiResponse<TicketCheckInResponse>>(
      `${BASE_URL}/scan`,
      null,
      {
        params: { ticketCode }
      }
    );
    return response.data;
  }
};

export default TicketApi;