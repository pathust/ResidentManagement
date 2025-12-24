// src/services/statsAPI.js
import apiClient from './apiClient';

export const statsAPI = {
  // Thống kê tổng quan nhân khẩu
  getOverviewPersons: async () => {
    try {
      const { data } = await apiClient.get('/api/stats/overview/persons');
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải thống kê nhân khẩu');
    }
  },

  // Thống kê tổng quan hộ khẩu
  getOverviewHouseholds: async () => {
    try {
      const { data } = await apiClient.get('/api/stats/overview/households');
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải thống kê hộ khẩu');
    }
  },

  // Thống kê nhân khẩu theo phường/xã
  getWardPersons: async (wardId) => {
    try {
      const { data } = await apiClient.get(`/api/stats/wards/${wardId}/persons`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải thống kê phường/xã');
    }
  },

  // Thống kê hộ khẩu theo phường/xã
  getWardHouseholds: async (wardId) => {
    try {
      const { data } = await apiClient.get(`/api/stats/wards/${wardId}/households`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải thống kê hộ khẩu theo phường');
    }
  }
};