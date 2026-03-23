package com.jobtrail.service.implementations;

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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String extractedText = extractTextFromPdf(file);

        Resume resume = Resume.builder()
                .user(user)
                .versionName(versionName)
                .resumeText(extractedText)
                .fileUrl(file.getOriginalFilename())
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
    public void deleteResume(Long resumeId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByResumeIdAndUserUserId(resumeId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Unlink resume from any applications that reference it
        List<Application> linked = applicationRepository.findByUserUserId(user.getUserId())
                .stream()
                .filter(a -> a.getResume() != null && a.getResume().getResumeId().equals(resumeId))
                .toList();

        linked.forEach(a -> a.setResume(null));
        applicationRepository.saveAll(linked);

        resumeRepository.delete(resume);
    }

    private String extractTextFromPdf(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from PDF: " + e.getMessage());
        }
    }
}