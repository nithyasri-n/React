import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchHotels = createAsyncThunk("hotels/fetchHotels", async () => {
  const response = await API.get("/hotels");
  return response.data;
});

export const fetchHotelPage = createAsyncThunk(
  "hotels/fetchHotelPage",
  async ({ search, maxPrice, limit, offset }) => {
    const response = await API.get("/hotels", {
      params: {
        search,
        maxPrice,
        limit,
        offset,
      },
    });

    return {
      hotels: response.data,
      total: Number(response.headers["x-total-count"] || 0),
    };
  },
);

export const createHotel = createAsyncThunk(
  "hotels/createHotel",
  async (hotel) => {
    const formData = new FormData();

    formData.append("name", hotel.name);
    formData.append("description", hotel.description);
    formData.append("latitude", hotel.latitude);
    formData.append("longitude", hotel.longitude);
    formData.append("price", hotel.price);

    if (hotel.image instanceof File) {
      formData.append("image", hotel.image);
    }

    const response = await API.post("/hotels", formData);
    return response.data.hotel;
  },
);

export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async ({ id, hotel }) => {
    const formData = new FormData();

    formData.append("name", hotel.name);
    formData.append("description", hotel.description);
    formData.append("latitude", hotel.latitude);
    formData.append("longitude", hotel.longitude);
    formData.append("price", hotel.price);

    if (hotel.image instanceof File) {
      formData.append("image", hotel.image);
    }

    const response = await API.put(`/hotels/${id}`, formData);
    return response.data.hotel;
  },
);

export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (id) => {
    await API.delete(`/hotels/${id}`);
    return id;
  },
);

const initialState = {
  hotels: [],
  pageHotels: [],
  pageTotal: 0,
  loading: false,
  pageLoading: false,
  error: null,
};

const hotelsSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchHotelPage.pending, (state) => {
        state.pageLoading = true;
      })
      .addCase(fetchHotelPage.fulfilled, (state, action) => {
        state.pageLoading = false;
        state.pageHotels = action.payload.hotels;
        state.pageTotal = action.payload.total;
      })
      .addCase(fetchHotelPage.rejected, (state, action) => {
        state.pageLoading = false;
        state.error = action.error.message;
      })

      .addCase(createHotel.fulfilled, (state, action) => {
        state.hotels.unshift(action.payload);
      })

      .addCase(updateHotel.fulfilled, (state, action) => {
        const index = state.hotels.findIndex(
          (hotel) => String(hotel.id) === String(action.payload.id),
        );

        if (index !== -1) {
          state.hotels[index] = action.payload;
        }

        const pageIndex = state.pageHotels.findIndex(
          (hotel) => String(hotel.id) === String(action.payload.id),
        );

        if (pageIndex !== -1) {
          state.pageHotels[pageIndex] = action.payload;
        }
      })

      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.hotels = state.hotels.filter(
          (hotel) => String(hotel.id) !== String(action.payload),
        );

        state.pageHotels = state.pageHotels.filter(
          (hotel) => String(hotel.id) !== String(action.payload),
        );

        state.pageTotal = Math.max(0, state.pageTotal - 1);
      });
  },
});

export default hotelsSlice.reducer;
