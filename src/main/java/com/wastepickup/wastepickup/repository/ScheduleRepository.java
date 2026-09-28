package com.wastepickup.wastepickup.repository;

import com.wastepickup.wastepickup.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}