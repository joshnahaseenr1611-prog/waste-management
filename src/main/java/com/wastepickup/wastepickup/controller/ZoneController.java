package com.wastepickup.wastepickup.controller;

import com.wastepickup.wastepickup.entity.Zone;
import com.wastepickup.wastepickup.service.ZoneService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    // CREATE ZONE
    @PostMapping
    public Zone createZone(@Valid @RequestBody Zone zone) {
        return zoneService.createZone(zone);
    }

    // GET ALL ZONES
    @GetMapping
    public List<Zone> getAllZones() {
        return zoneService.getAllZones();
    }

    // GET ZONE BY ID
    @GetMapping("/{id}")
    public Zone getZoneById(@PathVariable Long id) {
        return zoneService.getZoneById(id);
    }

    // UPDATE ZONE
    @PutMapping("/{id}")
    public Zone updateZone(
            @PathVariable Long id,
            @Valid @RequestBody Zone zone) {

        return zoneService.updateZone(id, zone);
    }

    // DELETE ZONE
    @DeleteMapping("/{id}")
    public String deleteZone(@PathVariable Long id) {

        zoneService.deleteZone(id);

        return "Zone deleted successfully";
    }
}