package com.Thuba.propertymanagement.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AiTaskTracker {

    // Stores JobID -> List of Amenities (or null if pending/failed)
    private final ConcurrentHashMap<String, Object> tasks = new ConcurrentHashMap<>();

    public void startTask(String jobId) {
        tasks.put(jobId, "PENDING");
    }

    public void completeTask(String jobId, List<String> amenities) {
        tasks.put(jobId, amenities);
    }

    public void failTask(String jobId) {
        tasks.put(jobId, "ERROR");
    }

    public Object getTaskResult(String jobId) {
        return tasks.get(jobId);
    }
}