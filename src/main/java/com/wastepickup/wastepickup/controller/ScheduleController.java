package com.wastepickup.wastepickup.controller;

import com.wastepickup.wastepickup.entity.Schedule;
import com.wastepickup.wastepickup.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public Schedule getSchedule(@PathVariable Long id) {
        return scheduleService.getScheduleById(id);
    }

    @PostMapping("/zone/{zoneId}")
    public Schedule createSchedule(
            @PathVariable Long zoneId,
            @RequestBody Schedule schedule) {

        return scheduleService.createSchedule(zoneId, schedule);
    }

    @PutMapping("/{id}")
    public Schedule updateSchedule(
            @PathVariable Long id,
            @RequestBody Schedule schedule) {

        return scheduleService.updateSchedule(id, schedule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Long id) {

        scheduleService.deleteSchedule(id);

        return ResponseEntity.ok("Schedule deleted successfully");
    }
}