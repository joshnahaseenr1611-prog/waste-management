package com.wastepickup.wastepickup.service;

import com.wastepickup.wastepickup.entity.Zone;
import com.wastepickup.wastepickup.exception.ResourceNotFoundException;
import com.wastepickup.wastepickup.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;

    public ZoneService(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    public Zone createZone(Zone zone) {
        return zoneRepository.save(zone);
    }

    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    public Zone getZoneById(Long id) {
        return zoneRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Zone not found with id: " + id));
    }

    public Zone updateZone(Long id, Zone updatedZone) {

        Zone zone = getZoneById(id);

        zone.setName(updatedZone.getName());
        zone.setLocation(updatedZone.getLocation());

        return zoneRepository.save(zone);
    }

    public void deleteZone(Long id) {

        Zone zone = getZoneById(id);

        zoneRepository.delete(zone);
    }
}