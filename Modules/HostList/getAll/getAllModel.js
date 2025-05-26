const db = require('../../../config/db');
const BasicInfo = require('../basicInfo/basicInfoModels');
const LocationDetails = require('../locationDetails/locationDetailsModels');
const Room = require('../roomSetup/roomSetupModels');

class GetAllInfo {
    static async getAllCombinedInfo(userId) {
        try {
            const query = `
               SELECT 
    bi.*,                      -- All columns from basic_info
    fa.*,                      -- All columns from facilities_amenities
    ld.*,                      -- All columns from location_details
    pd.*,                      -- All columns from property_details
    pr.*,                      -- All columns from property_rules
    ri.image_paths,            -- Explicitly select image_paths from room_images
    rpa.*,                     -- All columns from room_pricing_availability
    rs.*,                      -- All columns from room_setup
    rpa.number_of_rooms as rpa_number_of_rooms,  -- Explicitly select number_of_rooms from room_pricing_availability
    rgpd.id as pricing_id,
    DATE_FORMAT(rgpd.pricing_date, '%Y-%m-%d') as pricing_date,
    rgpd.adults,
    rgpd.price,
    rgpd.currency,
    rgpd.child_age_from,
    rgpd.child_age_to,
    rgpd.child_price,
    DATE_FORMAT(rgpd.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
    DATE_FORMAT(rgpd.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
FROM 
    basic_info bi
LEFT JOIN 
    facilities_amenities fa ON bi.property_id = fa.property_id
LEFT JOIN 
    location_details ld ON bi.property_id = ld.property_id AND bi.user_id = ld.user_id
LEFT JOIN 
    property_details pd ON bi.property_id = pd.property_id
LEFT JOIN 
    property_rules pr ON bi.property_id = pr.property_id AND bi.user_id = pr.user_id
LEFT JOIN 
    room_setup rs ON bi.property_id = rs.property_id AND bi.user_id = rs.user_id
LEFT JOIN 
    room_images ri ON ri.property_id = bi.property_id AND ri.room_id = rs.room_id
LEFT JOIN 
    room_pricing_availability rpa ON rpa.property_id = bi.property_id 
    AND rpa.floor = rs.floor 
    AND rpa.room_type = rs.room_type
LEFT JOIN
    room_guest_pricing_dates rgpd ON rgpd.room_id = rs.room_id;
            `;

            const [results] = await db.query(query, [userId]);

            if (!results || results.length === 0) {
                return [];
            }

            // Group results by property_id
            const propertiesMap = new Map();

            results.forEach(result => {
                const roomInfo = {
                    room_id: result.room_id,
                    image_urls: result.image_paths ? JSON.parse(result.image_paths) : [],
                    floor: result.floor,
                    room_type: result.room_type,
                    number_of_rooms: result.number_of_rooms,
                    rpa_number_of_rooms: result.rpa_number_of_rooms,
                    total_capacity: result.total_capacity,
                    room_capacity_adults: result.room_capacity_adults,
                    room_capacity_children: result.room_capacity_children,
                    base_price: result.base_price,
                    occupancy_price_adjustments: result.occupancy_price_adjustments,
                    child_pricing: result.child_pricing,
                    instant_payment_enabled: result.instant_payment_enabled,
                    free_cancellation_enabled: result.free_cancellation_enabled,
                    refundable1: result.refundable1,
                    days_before1: result.days_before1,
                    refund_percent1: result.refund_percent1,
                    refundable2: result.refundable2,
                    days_before2: result.days_before2,
                    refund_percent2: result.refund_percent2,
                    refundable3: result.refundable3,
                    days_before3: result.days_before3,
                    refund_percent3: result.refund_percent3,
                    pricing_dates: []
                };

                if (!propertiesMap.has(result.property_id)) {
                    propertiesMap.set(result.property_id, {
                        property_id: result.property_id,
                        user_id: result.user_id,
                        property_name: result.property_name,
                        property_type: result.property_type,
                        created_at: result.created_at,
                        updated_at: result.updated_at,
                        location: {
                            address_line1: result.address_line1,
                            address_line2: result.address_line2,
                            city: result.city,
                            state_province: result.state_province,
                            country: result.country,
                            postal_code: result.postal_code,
                            latitude: result.latitude,
                            longitude: result.longitude
                        },
                        facilities: {
                            gym: result.gym,
                            swimming_pool: result.swimming_pool,
                            spa: result.spa,
                            restaurant: result.restaurant,
                            room_service_24hr: result.room_service_24hr,
                            lounge: result.lounge,
                            steam_sauna: result.steam_sauna,
                            bar: result.bar,
                            free_parking: result.free_parking,
                            free_wifi: result.free_wifi,
                            refrigerator: result.refrigerator,
                            laundry_service: result.laundry_service,
                            housekeeping: result.housekeeping,
                            air_conditioning: result.air_conditioning,
                            power_backup: result.power_backup,
                            ev_charging: result.ev_charging,
                            smoke_detector: result.smoke_detector,
                            umbrellas: result.umbrellas,
                            elevator: result.elevator,
                            paid_lan: result.paid_lan,
                            dining_area: result.dining_area,
                            cafe_24hr: result.cafe_24hr,
                            barbeque: result.barbeque,
                            bakery: result.bakery,
                            coffee_shop_24hr: result.coffee_shop_24hr,
                            fire_extinguishers: result.fire_extinguishers,
                            cctv: result.cctv,
                            security_alarms: result.security_alarms,
                            reflexology: result.reflexology,
                            first_aid: result.first_aid,
                            tv: result.tv,
                            luggage_storage: result.luggage_storage,
                            wake_up_call: result.wake_up_call,
                            concierge: result.concierge,
                            doctor_on_call: result.doctor_on_call,
                            wheelchair: result.wheelchair,
                            luggage_assistance: result.luggage_assistance,
                            bellboy_service: result.bellboy_service,
                            pool_beach_towels: result.pool_beach_towels,
                            multilingual_staff: result.multilingual_staff,
                            accessible_facilities: result.accessible_facilities,
                            massage: result.massage,
                            printer: result.printer,
                            photocopying: result.photocopying,
                            conference_room: result.conference_room,
                            banquet: result.banquet
                        },
                        rules: {
                            can_book_married_couples: result.can_book_married_couples,
                            can_book_families: result.can_book_families,
                            can_book_solo_travelers: result.can_book_solo_travelers,
                            can_book_friends: result.can_book_friends,
                            instant_booking: result.instant_booking,
                            manual_approval: result.manual_approval,
                            check_in_time: result.check_in_time,
                            check_out_time: result.check_out_time,
                            min_guest_age: result.min_guest_age,
                            proof_type: result.proof_type,
                            unmarried_couples_allowed: result.unmarried_couples_allowed,
                            male_only_groups_allowed: result.male_only_groups_allowed,
                            scanty_baggage_allowed: result.scanty_baggage_allowed,
                            smoking_allowed: result.smoking_allowed,
                            alcohol_allowed: result.alcohol_allowed,
                            non_veg_allowed: result.non_veg_allowed,
                            outside_food_allowed: result.outside_food_allowed,
                            food_delivery_service: result.food_delivery_service,
                            wheelchair_accessible: result.wheelchair_accessible,
                            wheelchair_provided: result.wheelchair_provided,
                            pets_allowed: result.pets_allowed,
                            pets_on_property: result.pets_on_property,
                            mattress_cost_child: result.mattress_cost_child,
                            mattress_cost_adult: result.mattress_cost_adult,
                            cot_cost: result.cot_cost,
                            rule_description: result.rule_description
                        },
                        rooms: [roomInfo],
                        property_details: {
                            description: result.description,
                            nearest_beach_distance: result.nearest_beach_distance,
                            nearest_railway_station_distance: result.nearest_railway_station_distance,
                            nearest_airport_distance: result.nearest_airport_distance,
                            nearest_bus_stand_distance: result.nearest_bus_stand_distance,
                            can_book_married_couples: result.can_book_married_couples,
                            can_book_families: result.can_book_families,
                            can_book_solo_travelers: result.can_book_solo_travelers,
                            can_book_friends: result.can_book_friends,
                            instant_booking: result.instant_booking,
                            manual_approval: result.manual_approval,
                            created_at: result.created_at,
                            updated_at: result.updated_at
                        }
                    });
                } else {
                    const property = propertiesMap.get(result.property_id);
                    const existingRoomIndex = property.rooms.findIndex(room => room.room_id === roomInfo.room_id);
                    
                    if (existingRoomIndex === -1) {
                        // Room doesn't exist, add it
                        property.rooms.push(roomInfo);
                    }
                }

                // Add pricing date if it exists
                if (result.pricing_id) {
                    const property = propertiesMap.get(result.property_id);
                    const room = property.rooms.find(r => r.room_id === result.room_id);
                    if (room) {
                        room.pricing_dates.push({
                            id: result.pricing_id,
                            pricing_date: result.pricing_date,
                            adults: result.adults,
                            price: result.price,
                            currency: result.currency,
                            child_age_from: result.child_age_from,
                            child_age_to: result.child_age_to,
                            child_price: result.child_price,
                            created_at: result.created_at,
                            updated_at: result.updated_at
                        });
                    }
                }
            });

            return Array.from(propertiesMap.values());
        } catch (error) {
            console.error('Error getting combined info:', error);
            throw error;
        }
    }

    static async getCombinedInfoById(id) {
        try {
            const query = `
                SELECT 
                    bi.*,
                    fa.*,
                    ld.*,
                    pd.*,
                    pr.*,
                    ri.image_paths,
                    rpa.*,
                    rs.*
                FROM basic_info bi
                LEFT JOIN facilities_amenities fa ON bi.property_id = fa.property_id
                LEFT JOIN location_details ld ON bi.property_id = ld.property_id AND bi.user_id = ld.user_id
                LEFT JOIN property_details pd ON bi.property_id = pd.property_id
                LEFT JOIN property_rules pr ON bi.property_id = pr.property_id AND bi.user_id = pr.user_id
                LEFT JOIN room_setup rs ON bi.property_id = rs.property_id AND bi.user_id = rs.user_id
                LEFT JOIN room_images ri ON ri.property_id = bi.property_id AND ri.room_id = rs.room_id
                LEFT JOIN room_pricing_availability rpa ON rpa.property_id = bi.property_id 
                    AND rpa.floor = rs.floor 
                    AND rpa.room_type = rs.room_type
                WHERE bi.user_id = ?
            `;

            const [results] = await db.query(query, [id]);

            if (!results || results.length === 0) {
                return null;
            }

            // Group results by property_id
            const propertiesMap = new Map();

            results.forEach(result => {
                if (!propertiesMap.has(result.property_id)) {
                    propertiesMap.set(result.property_id, {
                        property_id: result.property_id,
                        user_id: result.user_id,
                        property_name: result.property_name,
                        property_type: result.property_type,
                        created_at: result.created_at,
                        updated_at: result.updated_at,
                        location: {
                            address_line1: result.address_line1,
                            address_line2: result.address_line2,
                            city: result.city,
                            state_province: result.state_province,
                            country: result.country,
                            postal_code: result.postal_code,
                            latitude: result.latitude,
                            longitude: result.longitude
                        },
                        facilities: {
                            gym: result.gym,
                            swimming_pool: result.swimming_pool,
                            spa: result.spa,
                            restaurant: result.restaurant,
                            room_service_24hr: result.room_service_24hr,
                            lounge: result.lounge,
                            steam_sauna: result.steam_sauna,
                            bar: result.bar,
                            free_parking: result.free_parking,
                            free_wifi: result.free_wifi,
                            refrigerator: result.refrigerator,
                            laundry_service: result.laundry_service,
                            housekeeping: result.housekeeping,
                            air_conditioning: result.air_conditioning,
                            power_backup: result.power_backup,
                            ev_charging: result.ev_charging,
                            smoke_detector: result.smoke_detector,
                            umbrellas: result.umbrellas,
                            elevator: result.elevator,
                            paid_lan: result.paid_lan,
                            dining_area: result.dining_area,
                            cafe_24hr: result.cafe_24hr,
                            barbeque: result.barbeque,
                            bakery: result.bakery,
                            coffee_shop_24hr: result.coffee_shop_24hr,
                            fire_extinguishers: result.fire_extinguishers,
                            cctv: result.cctv,
                            security_alarms: result.security_alarms,
                            reflexology: result.reflexology,
                            first_aid: result.first_aid,
                            tv: result.tv,
                            luggage_storage: result.luggage_storage,
                            wake_up_call: result.wake_up_call,
                            concierge: result.concierge,
                            doctor_on_call: result.doctor_on_call,
                            wheelchair: result.wheelchair,
                            luggage_assistance: result.luggage_assistance,
                            bellboy_service: result.bellboy_service,
                            pool_beach_towels: result.pool_beach_towels,
                            multilingual_staff: result.multilingual_staff,
                            accessible_facilities: result.accessible_facilities,
                            massage: result.massage,
                            printer: result.printer,
                            photocopying: result.photocopying,
                            conference_room: result.conference_room,
                            banquet: result.banquet
                        },
                        rules: {
                            can_book_married_couples: result.can_book_married_couples,
                            can_book_families: result.can_book_families,
                            can_book_solo_travelers: result.can_book_solo_travelers,
                            can_book_friends: result.can_book_friends,
                            instant_booking: result.instant_booking,
                            manual_approval: result.manual_approval,
                            check_in_time: result.check_in_time,
                            check_out_time: result.check_out_time,
                            min_guest_age: result.min_guest_age,
                            proof_type: result.proof_type,
                            unmarried_couples_allowed: result.unmarried_couples_allowed,
                            male_only_groups_allowed: result.male_only_groups_allowed,
                            scanty_baggage_allowed: result.scanty_baggage_allowed,
                            smoking_allowed: result.smoking_allowed,
                            alcohol_allowed: result.alcohol_allowed,
                            non_veg_allowed: result.non_veg_allowed,
                            outside_food_allowed: result.outside_food_allowed,
                            food_delivery_service: result.food_delivery_service,
                            wheelchair_accessible: result.wheelchair_accessible,
                            wheelchair_provided: result.wheelchair_provided,
                            pets_allowed: result.pets_allowed,
                            pets_on_property: result.pets_on_property,
                            mattress_cost_child: result.mattress_cost_child,
                            mattress_cost_adult: result.mattress_cost_adult,
                            cot_cost: result.cot_cost,
                            rule_description: result.rule_description
                        },
                        room: {
                            room_id: result.room_id,
                            image_urls: result.image_paths ? JSON.parse(result.image_paths) : [],
                            floor: result.floor,
                            room_type: result.room_type,
                            rpa_number_of_rooms: result.rpa_number_of_rooms,
                            number_of_rooms: result.number_of_rooms,
                            total_capacity: result.total_capacity,
                            room_capacity_adults: result.room_capacity_adults,
                            room_capacity_children: result.room_capacity_children,
                            base_price: result.base_price,
                            occupancy_price_adjustments: result.occupancy_price_adjustments,
                            child_pricing: result.child_pricing,
                            instant_payment_enabled: result.instant_payment_enabled,
                            free_cancellation_enabled: result.free_cancellation_enabled,
                            refundable1: result.refundable1,
                            days_before1: result.days_before1,
                            refund_percent1: result.refund_percent1,
                            refundable2: result.refundable2,
                            days_before2: result.days_before2,
                            refund_percent2: result.refund_percent2,
                            refundable3: result.refundable3,
                            days_before3: result.days_before3,
                            refund_percent3: result.refund_percent3
                        },
                        room_setup: {
                            room_id: result.room_id,
                            floor: result.floor,
                            room_type: result.room_type,
                            number_of_rooms: result.number_of_rooms,
                            created_at: result.created_at,
                            updated_at: result.updated_at
                        },
                        property_details: {
                            description: result.description,
                            nearest_beach_distance: result.nearest_beach_distance,
                            nearest_railway_station_distance: result.nearest_railway_station_distance,
                            nearest_airport_distance: result.nearest_airport_distance,
                            nearest_bus_stand_distance: result.nearest_bus_stand_distance,
                            can_book_married_couples: result.can_book_married_couples,
                            can_book_families: result.can_book_families,
                            can_book_solo_travelers: result.can_book_solo_travelers,
                            can_book_friends: result.can_book_friends,
                            instant_booking: result.instant_booking,
                            manual_approval: result.manual_approval,
                            created_at: result.created_at,
                            updated_at: result.updated_at
                        }
                    });
                }
            });

            return Array.from(propertiesMap.values());
        } catch (error) {
            console.error('Error getting combined info by ID:', error);
            throw error;
        }
    }
    static async getCombinedInfoBypropertyId(id) {
        try {
            const query = `
                SELECT 
                    bi.*,
                    fa.*,
                    ld.*,
                    pd.*,
                    pr.*,
                    ri.image_paths,
                    rpa.*,
                    rs.*,
                    rpa.number_of_rooms as rpa_number_of_rooms,  -- Explicitly select number_of_rooms from room_pricing_availability
                    rgpd.id as pricing_id,
                    DATE_FORMAT(rgpd.pricing_date, '%Y-%m-%d') as pricing_date,
                    rgpd.adults,
                    rgpd.price,
                    rgpd.currency,
                    rgpd.child_age_from,
                    rgpd.child_age_to,
                    rgpd.child_price,
                    DATE_FORMAT(rgpd.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
                    DATE_FORMAT(rgpd.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
                FROM basic_info bi
                LEFT JOIN facilities_amenities fa ON bi.property_id = fa.property_id
                LEFT JOIN location_details ld ON bi.property_id = ld.property_id AND bi.user_id = ld.user_id
                LEFT JOIN property_details pd ON bi.property_id = pd.property_id
                LEFT JOIN property_rules pr ON bi.property_id = pr.property_id AND bi.user_id = pr.user_id
                LEFT JOIN room_setup rs ON bi.property_id = rs.property_id AND bi.user_id = rs.user_id
                LEFT JOIN room_images ri ON ri.property_id = bi.property_id AND ri.room_id = rs.room_id
                LEFT JOIN room_pricing_availability rpa ON rpa.property_id = bi.property_id 
                    AND rpa.floor = rs.floor 
                    AND rpa.room_type = rs.room_type
                LEFT JOIN room_guest_pricing_dates rgpd ON rgpd.room_id = rs.room_id
                WHERE bi.property_id = ?
            `;

            const [results] = await db.query(query, [id]);

            if (!results || results.length === 0) {
                return null;
            }

            // Group results by property_id
            const propertiesMap = new Map();

            results.forEach(result => {
                const roomInfo = {
                    room_id: result.room_id,
                    image_urls: result.image_paths ? JSON.parse(result.image_paths) : [],
                    floor: result.floor,
                    room_type: result.room_type,
                    rpa_number_of_rooms: result.rpa_number_of_rooms,
                    number_of_rooms: result.number_of_rooms,
                    total_capacity: result.total_capacity,
                    room_capacity_adults: result.room_capacity_adults,
                    room_capacity_children: result.room_capacity_children,
                    base_price: result.base_price,
                    occupancy_price_adjustments: result.occupancy_price_adjustments,
                    child_pricing: result.child_pricing,
                    instant_payment_enabled: result.instant_payment_enabled,
                    free_cancellation_enabled: result.free_cancellation_enabled,
                    refundable1: result.refundable1,
                    days_before1: result.days_before1,
                    refund_percent1: result.refund_percent1,
                    refundable2: result.refundable2,
                    days_before2: result.days_before2,
                    refund_percent2: result.refund_percent2,
                    refundable3: result.refundable3,
                    days_before3: result.days_before3,
                    refund_percent3: result.refund_percent3,
                    pricing_dates: []
                };

                if (!propertiesMap.has(result.property_id)) {
                    propertiesMap.set(result.property_id, {
                        property_id: result.property_id,
                        user_id: result.user_id,
                        property_name: result.property_name,
                        property_type: result.property_type,
                        created_at: result.created_at,
                        updated_at: result.updated_at,
                        location: {
                            address_line1: result.address_line1,
                            address_line2: result.address_line2,
                            city: result.city,
                            state_province: result.state_province,
                            country: result.country,
                            postal_code: result.postal_code,
                            latitude: result.latitude,
                            longitude: result.longitude
                        },
                        facilities: {
                            gym: result.gym,
                            swimming_pool: result.swimming_pool,
                            spa: result.spa,
                            restaurant: result.restaurant,
                            room_service_24hr: result.room_service_24hr,
                            lounge: result.lounge,
                            steam_sauna: result.steam_sauna,
                            bar: result.bar,
                            free_parking: result.free_parking,
                            free_wifi: result.free_wifi,
                            refrigerator: result.refrigerator,
                            laundry_service: result.laundry_service,
                            housekeeping: result.housekeeping,
                            air_conditioning: result.air_conditioning,
                            power_backup: result.power_backup,
                            ev_charging: result.ev_charging,
                            smoke_detector: result.smoke_detector,
                            umbrellas: result.umbrellas,
                            elevator: result.elevator,
                            paid_lan: result.paid_lan,
                            dining_area: result.dining_area,
                            cafe_24hr: result.cafe_24hr,
                            barbeque: result.barbeque,
                            bakery: result.bakery,
                            coffee_shop_24hr: result.coffee_shop_24hr,
                            fire_extinguishers: result.fire_extinguishers,
                            cctv: result.cctv,
                            security_alarms: result.security_alarms,
                            reflexology: result.reflexology,
                            first_aid: result.first_aid,
                            tv: result.tv,
                            luggage_storage: result.luggage_storage,
                            wake_up_call: result.wake_up_call,
                            concierge: result.concierge,
                            doctor_on_call: result.doctor_on_call,
                            wheelchair: result.wheelchair,
                            luggage_assistance: result.luggage_assistance,
                            bellboy_service: result.bellboy_service,
                            pool_beach_towels: result.pool_beach_towels,
                            multilingual_staff: result.multilingual_staff,
                            accessible_facilities: result.accessible_facilities,
                            massage: result.massage,
                            printer: result.printer,
                            photocopying: result.photocopying,
                            conference_room: result.conference_room,
                            banquet: result.banquet
                        },
                        rules: {
                            can_book_married_couples: result.can_book_married_couples,
                            can_book_families: result.can_book_families,
                            can_book_solo_travelers: result.can_book_solo_travelers,
                            can_book_friends: result.can_book_friends,
                            instant_booking: result.instant_booking,
                            manual_approval: result.manual_approval,
                            check_in_time: result.check_in_time,
                            check_out_time: result.check_out_time,
                            min_guest_age: result.min_guest_age,
                            proof_type: result.proof_type,
                            unmarried_couples_allowed: result.unmarried_couples_allowed,
                            male_only_groups_allowed: result.male_only_groups_allowed,
                            scanty_baggage_allowed: result.scanty_baggage_allowed,
                            smoking_allowed: result.smoking_allowed,
                            alcohol_allowed: result.alcohol_allowed,
                            non_veg_allowed: result.non_veg_allowed,
                            outside_food_allowed: result.outside_food_allowed,
                            food_delivery_service: result.food_delivery_service,
                            wheelchair_accessible: result.wheelchair_accessible,
                            wheelchair_provided: result.wheelchair_provided,
                            pets_allowed: result.pets_allowed,
                            pets_on_property: result.pets_on_property,
                            mattress_cost_child: result.mattress_cost_child,
                            mattress_cost_adult: result.mattress_cost_adult,
                            cot_cost: result.cot_cost,
                            rule_description: result.rule_description
                        },
                        rooms: [roomInfo],
                        property_details: {
                            description: result.description,
                            nearest_beach_distance: result.nearest_beach_distance,
                            nearest_railway_station_distance: result.nearest_railway_station_distance,
                            nearest_airport_distance: result.nearest_airport_distance,
                            nearest_bus_stand_distance: result.nearest_bus_stand_distance,
                            can_book_married_couples: result.can_book_married_couples,
                            can_book_families: result.can_book_families,
                            can_book_solo_travelers: result.can_book_solo_travelers,
                            can_book_friends: result.can_book_friends,
                            instant_booking: result.instant_booking,
                            manual_approval: result.manual_approval,
                            created_at: result.created_at,
                            updated_at: result.updated_at
                        }
                    });
                } else {
                    const property = propertiesMap.get(result.property_id);
                    const existingRoomIndex = property.rooms.findIndex(room => room.room_id === roomInfo.room_id);
                    
                    if (existingRoomIndex === -1) {
                        // Room doesn't exist, add it
                        property.rooms.push(roomInfo);
                    }
                }

                // Add pricing date if it exists
                if (result.pricing_id) {
                    const property = propertiesMap.get(result.property_id);
                    const room = property.rooms.find(r => r.room_id === result.room_id);
                    if (room) {
                        room.pricing_dates.push({
                            id: result.pricing_id,
                            pricing_date: result.pricing_date,
                            adults: result.adults,
                            price: result.price,
                            currency: result.currency,
                            child_age_from: result.child_age_from,
                            child_age_to: result.child_age_to,
                            child_price: result.child_price,
                            created_at: result.created_at,
                            updated_at: result.updated_at
                        });
                    }
                }
            });

            // Since we're querying by property_id, we should only have one property
            const properties = Array.from(propertiesMap.values());
            return properties[0];
        } catch (error) {
            console.error('Error getting combined info by property ID:', error);
            throw error;
        }
    }
    static async updateHostInfo(id, updateData) {
        try {
            // Get the current host info to ensure it exists
            const currentHost = await this.getCombinedInfoById(id);

            if (!currentHost) {
                return null;
            }

            // Update basic info if provided
            if (updateData.property_name) {
                await BasicInfo.updatePropertyById(id, { property_name: updateData.property_name });
            }

            // Only update location if location data is provided and has changed
            if (updateData.location && Object.keys(updateData.location).length > 0) {
                const locationId = currentHost.location?.id;
                if (locationId) {
                    await LocationDetails.updateLocationDetails(locationId, updateData.location);
                }
            }

            // Only update rooms if rooms data is provided and has changed
            if (updateData.rooms && Array.isArray(updateData.rooms) && updateData.rooms.length > 0) {
                // First delete existing rooms
                await Room.deleteRoomsByUserId(currentHost.user_id);
                // Then insert new rooms
                for (const room of updateData.rooms) {
                    await Room.createRoom({ ...room, user_id: currentHost.user_id });
                }
            }

            // Return the updated combined info
            return await this.getCombinedInfoById(id);
        } catch (error) {
            console.error('Error updating host info:', error);
            throw error;
        }
    }

    static async deleteHostInfo(id) {
        try {
            // Get the current host info to ensure it exists
            const currentHost = await this.getCombinedInfoById(id);

            if (!currentHost) {
                return null;
            }

            // Delete rooms first (due to foreign key constraints)
            if (currentHost.rooms && currentHost.rooms.length > 0) {
                await Room.deleteRoomsByUserId(currentHost.user_id);
            }

            // Delete location details
            if (currentHost.location) {
                await LocationDetails.deleteLocationDetails(currentHost.location.id);
            }

            // Finally delete the basic info
            const deletedBasicInfo = await BasicInfo.deletePropertyById(id);

            return deletedBasicInfo;
        } catch (error) {
            console.error('Error deleting host info:', error);
            throw error;
        }
    }
}

module.exports = GetAllInfo;