# D8A Backend - Enhanced Error Handling & Isolation

This backend has been enhanced with comprehensive error handling and request isolation to prevent crashes and ensure high availability.

## 🛡️ Key Improvements

### 1. **Process-Level Error Handling**

- **Uncaught Exception Handler**: Prevents the entire server from crashing when unexpected errors occur
- **Unhandled Rejection Handler**: Catches unhandled promise rejections
- **Graceful Shutdown**: Proper cleanup when the server is terminated

### 2. **Request Isolation**

- **Global Error Middleware**: Catches all errors and returns proper HTTP responses
- **Request Timeout Handling**: Prevents hanging requests (5 min for analysis, 1 min for others)
- **Resource Cleanup**: Automatic cleanup of temporary files and memory
- **Request Size Limits**: Prevents memory exhaustion from large payloads

### 3. **Enhanced CSV Processing**

- **Safe CSV Operations**: Wrapper function that handles file operations safely
- **Memory Management**: Limits on file size and data processing
- **Automatic Cleanup**: Temporary files are automatically deleted
- **Data Validation**: Comprehensive validation before processing

### 4. **Monitoring & Recovery**

- **Process Manager**: Automatically restarts the server if it crashes
- **Health Monitoring**: Continuous health checks and memory usage tracking
- **Request Logging**: Detailed logging of all requests with timing

## 🚀 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode (with auto-restart)

```bash
npm start
```

### Monitoring Mode

```bash
node monitor.js
```

## 📊 Error Handling Features

### Request-Level Protection

- Each request is wrapped in error handlers
- Timeouts prevent hanging operations
- Resource limits prevent memory exhaustion
- Automatic cleanup of temporary files

### Server-Level Protection

- Process-level error handlers prevent crashes
- Graceful shutdown handling
- Memory usage monitoring
- Automatic restart on failure

### CSV Processing Safety

- File size validation (max 1M rows)
- Memory usage limits
- Automatic resource cleanup
- Comprehensive error messages

## 🔧 Configuration

### Environment Variables

```bash
NODE_ENV=development  # or production
PORT=3000             # Server port
SERVER_URL=http://localhost:3000  # For monitoring
```

### Timeout Settings

- **Analysis Operations**: 5 minutes
- **Other Operations**: 1 minute
- **Health Checks**: 10 seconds

### Memory Limits

- **Max CSV Rows**: 1,000,000
- **Max Scatter Plot Points**: 10,000
- **Max Page Size**: 1,000 rows
- **Request Size Limit**: 50MB

## 📈 Monitoring

The monitoring script provides:

- **Health Checks**: Every 30 seconds
- **Memory Usage**: Every 5 minutes
- **Response Time Tracking**
- **Error Logging**

## 🛠️ Troubleshooting

### Common Issues

1. **Server Crashes**

   - Check logs for specific error messages
   - Verify file permissions for temp directory
   - Ensure sufficient memory is available

2. **Timeout Errors**

   - Large CSV files may need more time
   - Consider splitting large files
   - Check network connectivity for file downloads

3. **Memory Issues**
   - Reduce file sizes
   - Implement pagination for large datasets
   - Monitor memory usage with the monitoring script

### Log Analysis

- All errors are logged with timestamps
- Request timing information is available
- Memory usage is tracked automatically

## 🔒 Security Features

- **Input Validation**: All inputs are validated
- **File Type Checking**: Only CSV files are processed
- **Resource Limits**: Prevents DoS attacks
- **Error Sanitization**: Internal errors are not exposed to clients

## 📝 API Error Responses

All API endpoints now return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## 🚨 Emergency Procedures

If the server becomes unresponsive:

1. **Check Process Manager**: The process manager should automatically restart the server
2. **Manual Restart**: Kill the process and run `npm start`
3. **Check Logs**: Review error logs for specific issues
4. **Monitor Resources**: Use the monitoring script to check server health

## 📞 Support

For issues or questions:

1. Check the logs for specific error messages
2. Use the monitoring script to identify problems
3. Review this README for troubleshooting steps
4. Ensure all dependencies are properly installed
