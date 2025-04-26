// Test script for media-processing.js functions
require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const path = require('path');
const { 
  convertVideoToAudio, 
  performVoiceTagging, 
  transcribeWithWhisper,
  transcribeWithSpeakerInfo 
} = require('./media-processing');

// Path to a sample video file - replace with your own video file
const sampleVideoPath = './sample-video.mp4';

// Main test function to run all tests in sequence
async function runTests() {
  try {
    console.log('Starting tests...');
    
    // 1. Test video to audio conversion
    console.log('\n--- Testing Video to Audio Conversion ---');
    const audioPath = await convertVideoToAudio(sampleVideoPath);
    console.log(`Audio file created at: ${audioPath}`);
    
    // 2. Test speaker diarization (voice tagging)
    console.log('\n--- Testing Speaker Diarization ---');
    console.log('This may take some time depending on the audio length...');
    const speakerSegments = await performVoiceTagging(audioPath, 2); // Assuming 2 speakers
    console.log(`Found ${speakerSegments.length} speaker segments`);
    console.log('First few segments:');
    speakerSegments.slice(0, 3).forEach((segment, i) => {
      console.log(`Segment ${i+1}:`);
      console.log(`  Speaker: ${segment.speaker}`);
      console.log(`  Text: ${segment.text}`);
      console.log(`  Time: ${segment.startTime} - ${segment.endTime}`);
    });
    
    // 3. Test OpenAI Whisper transcription
    console.log('\n--- Testing Whisper Transcription ---');
    console.log('This may take some time depending on the audio length...');
    const transcription = await transcribeWithWhisper(audioPath);
    console.log('Transcription result:');
    console.log(transcription.text.slice(0, 200) + '...'); // Show first 200 chars
    
    // 4. Test combined speaker info with transcription
    console.log('\n--- Testing Transcription with Speaker Info ---');
    const transcriptWithSpeakers = await transcribeWithSpeakerInfo(audioPath, speakerSegments);
    console.log('Combined result:');
    console.log(`Full transcript: ${transcriptWithSpeakers.text.slice(0, 100)}...`);
    console.log('First few segments with speaker info:');
    transcriptWithSpeakers.segments.slice(0, 3).forEach((segment, i) => {
      console.log(`Segment ${i+1}:`);
      console.log(`  Speaker: ${segment.speaker}`);
      console.log(`  Transcription: ${segment.transcription.slice(0, 50)}...`);
    });
    
    console.log('\n--- All tests completed successfully ---');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests(); 