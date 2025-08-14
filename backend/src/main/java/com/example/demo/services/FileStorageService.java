package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED = Set.of("image/jpeg","image/png","image/webp");

    public String savePlaceImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        if (!ALLOWED.contains(file.getContentType()))
            throw new IOException("Type d'image non autorisé (jpeg/png/webp)");

        Path root = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(root);

        String ext = switch (file.getContentType()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };

        String base = StringUtils.cleanPath(
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"))
        );

        Path target = root.resolve(base + ext);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // URL publique via /media/**
        return "/media/" + target.getFileName();
    }

    public void deleteByPublicUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/media/")) return;
        String filename = imageUrl.substring("/media/".length());
        Path path = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
        try { Files.deleteIfExists(path); } catch (Exception ignored) {}
    }
}
