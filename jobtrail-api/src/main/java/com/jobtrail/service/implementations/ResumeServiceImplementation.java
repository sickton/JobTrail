package com.jobtrail.service.implementations;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jobtrail.dto.ResumeResponse;
import com.jobtrail.entity.Application;
import com.jobtrail.entity.Resume;
import com.jobtrail.entity.User;
import com.jobtrail.repository.ApplicationRepository;
import com.jobtrail.repository.ResumeRepository;
import com.jobtrail.repository.UserRepository;
import com.jobtrail.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * @author Srivathsa Mantrala
 * Service implementation for resume management
 */
@Service
@RequiredArgsConstructor
public class ResumeServiceImplementation implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final Cloudinary cloudinary;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Override
    public List<ResumeResponse> getResumes(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return resumeRepository.findByUserUserId(user.getUserId())
                .stream()
                .map(r -> new ResumeResponse(
                        r.getResumeId(),
                        r.getVersionName(),
                        r.getResumeText(),
                        r.getFileUrl(),
                        r.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public ResumeResponse addResume(String versionName, MultipartFile file, String username) {
        validateFile(file);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String extractedText = extractTextFromPdf(file);
        String fileUrl = uploadToCloudinary(file, username);

        Resume resume = Resume.builder()
                .user(user)
                .versionName(versionName)
                .resumeText(extractedText)
                .fileUrl(fileUrl)
                .build();

        Resume saved = resumeRepository.save(resume);

        return new ResumeResponse(
                saved.getResumeId(),
                saved.getVersionName(),
                saved.getResumeText(),
                saved.getFileUrl(),
                saved.getCreatedAt()
        );
    }

    @Override
    public String getResumeFileUrl(Long resumeId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByResumeIdAndUserUserId(resumeId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        return resume.getFileUrl();
    }

    @Override
    public void deleteResume(Long resumeId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByResumeIdAndUserUserId(resumeId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        deleteFromCloudinary(resume.getFileUrl());

        List<Application> linked = applicationRepository.findByUserUserId(user.getUserId())
                .stream()
                .filter(a -> a.getResume() != null && a.getResume().getResumeId().equals(resumeId))
                .toList();
        linked.forEach(a -> a.setResume(null));
        applicationRepository.saveAll(linked);

        resumeRepository.delete(resume);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new RuntimeException("File is empty");
        if (file.getSize() > MAX_FILE_SIZE)
            throw new RuntimeException("File exceeds 5MB limit");
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf"))
            throw new RuntimeException("Only PDF files are allowed");
    }

    private String uploadToCloudinary(MultipartFile file, String username) {
        try {
            String publicId = "resumes/" + username + "/" + UUID.randomUUID();
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id",     publicId,
                            "resource_type", "image"    // ← change "raw" to "image"
                    )
            );
            return (String) result.get("secure_url");
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to storage: " + e.getMessage());
        }
    }

    private void deleteFromCloudinary(String fileUrl) {
        try {
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId,
                    ObjectUtils.asMap("resource_type", "image"));  // ← change "raw" to "image"
        } catch (Exception ignored) {
            // Don't block DB deletion if cloud delete fails
        }
    }

    private String extractPublicId(String url) {
        // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}
        int uploadIdx = url.indexOf("/upload/");
        String afterUpload = url.substring(uploadIdx + 8);
        if (afterUpload.matches("v\\d+/.*")) {
            afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
        }
        return afterUpload;
    }

    private String extractTextFromPdf(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            return new PDFTextStripper().getText(document);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from PDF: " + e.getMessage());
        }
    }
}
