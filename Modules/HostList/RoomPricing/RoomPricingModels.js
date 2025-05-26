const db = require('../../../config/db') // assuming db is already configured

class RoomPricing {
  static async createRoomPricing(data) {
    const { 
      property_id, floor, room_type, number_of_rooms, room_capacity_adults, room_capacity_children,
      total_capacity, base_price, occupancy_price_adjustments, child_pricing, instant_payment_enabled, 
      free_cancellation_enabled, refundable1, days_before1, refund_percent1, refundable2, days_before2, 
      refund_percent2, refundable3, days_before3, refund_percent3, individual_room_capacities 
    } = data;

    try {
      // Log incoming data for debugging
      console.log('Incoming data:', {
        ...data,
        individual_room_capacities: typeof individual_room_capacities === 'string' 
          ? individual_room_capacities 
          : JSON.stringify(individual_room_capacities)
      });

      // Parse individual_room_capacities if it's a string
      let parsedRoomCapacities;
      try {
        parsedRoomCapacities = typeof individual_room_capacities === 'string'
          ? individual_room_capacities
          : JSON.stringify(individual_room_capacities || []);
        console.log('Parsed room capacities:', parsedRoomCapacities);
      } catch (e) {
        console.error('Error parsing individual_room_capacities:', e);
        parsedRoomCapacities = '[]';
      }

      // Ensure proper data types and formats
      const formattedData = {
        property_id: parseInt(property_id),
        floor: String(floor || ''),
        room_type: String(room_type || ''),
        number_of_rooms: String(number_of_rooms || ''),
        room_capacity_adults: parseInt(room_capacity_adults || 0),
        room_capacity_children: parseInt(room_capacity_children || 0),
        total_capacity: parseInt(total_capacity || 0),
        base_price: parseFloat(base_price || 0),
        occupancy_price_adjustments: typeof occupancy_price_adjustments === 'string' 
          ? occupancy_price_adjustments 
          : JSON.stringify(occupancy_price_adjustments || []),
        child_pricing: typeof child_pricing === 'string' 
          ? child_pricing 
          : JSON.stringify(child_pricing || []),
        instant_payment_enabled: instant_payment_enabled ? 1 : 0,
        free_cancellation_enabled: free_cancellation_enabled ? 1 : 0,
        refundable1: refundable1 ? 1 : 0,
        days_before1: days_before1 || null,
        refund_percent1: refund_percent1 || null,
        refundable2: refundable2 ? 1 : 0,
        days_before2: days_before2 || null,
        refund_percent2: refund_percent2 || null,
        refundable3: refundable3 ? 1 : 0,
        days_before3: days_before3 || null,
        refund_percent3: refund_percent3 || null,
        individual_room_capacities: parsedRoomCapacities
      };

      // Log the formatted data for debugging
      console.log('Formatted data before insert:', formattedData);

      const query = `
        INSERT INTO room_pricing_availability (
          property_id, floor, room_type, number_of_rooms, room_capacity_adults, room_capacity_children,
          total_capacity, base_price, occupancy_price_adjustments, child_pricing, instant_payment_enabled,
          free_cancellation_enabled, refundable1, days_before1, refund_percent1, refundable2, days_before2,
          refund_percent2, refundable3, days_before3, refund_percent3, individual_room_capacities
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await db.query(query, [
        formattedData.property_id,
        formattedData.floor,
        formattedData.room_type,
        formattedData.number_of_rooms,
        formattedData.room_capacity_adults,
        formattedData.room_capacity_children,
        formattedData.total_capacity,
        formattedData.base_price,
        formattedData.occupancy_price_adjustments,
        formattedData.child_pricing,
        formattedData.instant_payment_enabled,
        formattedData.free_cancellation_enabled,
        formattedData.refundable1,
        formattedData.days_before1,
        formattedData.refund_percent1,
        formattedData.refundable2,
        formattedData.days_before2,
        formattedData.refund_percent2,
        formattedData.refundable3,
        formattedData.days_before3,
        formattedData.refund_percent3,
        formattedData.individual_room_capacities
      ]);

      // Log the query result for debugging
      console.log('Insert result:', result);

      // Fetch the complete record after insertion with explicit column selection
      const selectQuery = `
        SELECT 
          id, property_id, floor, room_type, number_of_rooms, room_capacity_adults,
          room_capacity_children, total_capacity, base_price, occupancy_price_adjustments,
          child_pricing, instant_payment_enabled, free_cancellation_enabled,
          refundable1, days_before1, refund_percent1, refundable2, days_before2,
          refund_percent2, refundable3, days_before3, refund_percent3,
          individual_room_capacities
        FROM room_pricing_availability 
        WHERE id = ?`;

      const [insertedRecords] = await db.query(selectQuery, [result.insertId]);
      const record = insertedRecords[0];

      // Log the fetched record for debugging
      console.log('Fetched record after insert:', record);

      // Format the response data
      const responseData = {
        id: record.id,
        property_id: record.property_id,
        floor: record.floor,
        room_type: record.room_type,
        number_of_rooms: String(record.number_of_rooms),
        room_capacity_adults: record.room_capacity_adults,
        room_capacity_children: record.room_capacity_children,
        total_capacity: record.total_capacity,
        base_price: record.base_price,
        occupancy_price_adjustments: record.occupancy_price_adjustments,
        child_pricing: record.child_pricing,
        instant_payment_enabled: Boolean(record.instant_payment_enabled),
        free_cancellation_enabled: Boolean(record.free_cancellation_enabled),
        refundable1: Boolean(record.refundable1),
        days_before1: record.days_before1,
        refund_percent1: record.refund_percent1,
        refundable2: Boolean(record.refundable2),
        days_before2: record.days_before2,
        refund_percent2: record.refund_percent2,
        refundable3: Boolean(record.refundable3),
        days_before3: record.days_before3,
        refund_percent3: record.refund_percent3,
        individual_room_capacities: record.individual_room_capacities
      };

      // Log the response data for debugging
      console.log('Formatted response data:', responseData);

      return responseData;
    } catch (error) {
      console.error('Error in createRoomPricing:', error);
      throw error;
    }
  }

  // Additional methods for fetching or updating can be added
}

module.exports = RoomPricing;
