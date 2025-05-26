const RoomPricing = require('../RoomPricing/RoomPricingModels');

const createRoomPricing = async (req, res) => {
  try {
    const { 
      property_id, floor, room_type, number_of_rooms, room_capacity_adults, room_capacity_children,
      total_capacity, base_price, occupancy_price_adjustments, child_pricing, instant_payment_enabled, 
      free_cancellation_enabled, refundable1, days_before1, refund_percent1, refundable2, days_before2, 
      refund_percent2, refundable3, days_before3, refund_percent3, individual_room_capacities
    } = req.body;

    const roomPricingData = {
      property_id, floor, room_type, number_of_rooms, room_capacity_adults, room_capacity_children,
      total_capacity, base_price, occupancy_price_adjustments, child_pricing, instant_payment_enabled,
      free_cancellation_enabled, refundable1, days_before1, refund_percent1, refundable2, days_before2,
      refund_percent2, refundable3, days_before3, refund_percent3, individual_room_capacities
    };

    const result = await RoomPricing.createRoomPricing(roomPricingData);
    res.status(201).json({
      success: true,
      message: "Room pricing created successfully",
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createRoomPricing };
