package com.wastepickup.wastepickup.service;

import com.wastepickup.wastepickup.entity.Schedule;
import com.wastepickup.wastepickup.entity.Zone;
import com.wastepickup.wastepickup.repository.ScheduleRepository;
import com.wastepickup.wastepickup.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final ZoneRepository zoneRepository;

    public ScheduleService(ScheduleRepository scheduleRepository,
                           ZoneRepository zoneRepository) {
        this.scheduleRepository = scheduleRepository;
        this.zoneRepository = zoneRepository;
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    public Schedule createSchedule(Long zoneId, Schedule schedule) {

        Zone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        schedule.setZone(zone);

        return scheduleRepository.save(schedule);
    }

    public Schedule updateSchedule(Long id, Schedule updatedSchedule) {

        Schedule schedule = getScheduleById(id);

        schedule.setDay(updatedSchedule.getDay());
        schedule.setStartTime(updatedSchedule.getStartTime());
        schedule.setEndTime(updatedSchedule.getEndTime());

        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}