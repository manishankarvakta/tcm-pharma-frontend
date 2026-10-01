import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Form, Card, Modal, ProgressBar } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import * as Icons from "heroicons-react";
import hotToast from "react-hot-toast";
import Header from "../Common/Header/Header";

import SideBar from "../Common/SideBar/SideBar";
import axios from "../../services/apiClient";
import { useSelector } from "react-redux";
import AlertService from "../Utility/AlertService";

const toast = {
  success: (msg: any, opts?: any) => hotToast.success(msg, { position: 'bottom-right', ...opts }),
  error: (msg: any, opts?: any) => hotToast.error(msg, { position: 'bottom-right', ...opts }),
  loading: (msg: any, opts?: any) => hotToast.loading(msg, { position: 'bottom-right', ...opts }),
};

const BackupRestore = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    autoBackup: false,
    frequency: "Day",
    time: "02:00",
    backupType: "Full",
    syncToDrive: false,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [driveConfigs, setDriveConfigs] = useState<any[]>([]);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveFormData, setDriveFormData] = useState({ _id: "", name: "", folderId: "", serviceAccountJson: "", isActive: false });
  const [telegramConfigs, setTelegramConfigs] = useState<any[]>([]);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramFormData, setTelegramFormData] = useState({ _id: "", name: "", botToken: "", chatId: "", isActive: false });
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreStatus, setRestoreStatus] = useState("");


  // Fetch Settings & Backups
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const settingsRes = await axios.get("/backup/settings");
      if (settingsRes.data) {
        setSettings({
          autoBackup: settingsRes.data.autoBackup || false,
          frequency: settingsRes.data.frequency || "Day",
          time: settingsRes.data.time || "02:00",
          backupType: settingsRes.data.backupType || "Full",
          syncToDrive: settingsRes.data.syncToDrive || false,
        });
      }

      const backupsRes = await axios.get("/backup");
      if (backupsRes.data) setBackups(backupsRes.data);

      const driveConfigsRes = await axios.get("/backup/drive-configs");
      if (driveConfigsRes.data) setDriveConfigs(driveConfigsRes.data);

      const telegramConfigsRes = await axios.get("/backup/telegram-configs");
      if (telegramConfigsRes.data) setTelegramConfigs(telegramConfigsRes.data);
    } catch (error) {
      toast.error("Failed to fetch backup data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSettingsChange = (e: any) => {
    const target = e.target;
    const { name, value, type, checked } = target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      await axios.post("/backup/settings", settings);
      toast.success("Backup settings saved successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (type: string) => {
    try {
      setLoading(true);
      toast.loading(`Creating ${type} backup...`, { id: "backup-create" });
      const res = await axios.post("/backup/run", { type, syncToDrive: settings.syncToDrive });
      toast.success(res.data.message, { id: "backup-create" });
      fetchData();
    } catch (error) {
      toast.error("Failed to create backup", { id: "backup-create" });
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (id: string) => {
    const confirmed = await AlertService.confirm(
      "Restore Backup?",
      "Current data will be overwritten. This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setShowRestoreModal(true);
      setRestoreProgress(0);
      setRestoreStatus("Preparing to restore...");

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        setRestoreProgress(Math.floor(progress));

        if (progress < 30) setRestoreStatus("Extracting backup files...");
        else if (progress < 60) setRestoreStatus("Restoring database collections...");
        else if (progress < 85) setRestoreStatus("Applying file changes...");
        else setRestoreStatus("Finalizing restore process...");
      }, 800);

      await axios.post(`/backup/restore/${id}`);

      clearInterval(interval);
      setRestoreProgress(100);
      setRestoreStatus("Restore completed successfully! Logging out...");
      
      setTimeout(() => {
        setShowRestoreModal(false);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 2000);

    } catch (error) {
      toast.error("Restore failed");
      setShowRestoreModal(false);
    }
  };

  const deleteBackup = async (id: string) => {
    const confirmed = await AlertService.confirm("Delete Backup?", "Are you sure you want to delete this backup?");
    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(`/backup/${id}`);
      toast.success("Backup deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete backup");
    } finally {
      setLoading(false);
    }
  };

  const downloadBackup = (name: string) => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5006/api';
    window.open(`${baseUrl}/backup/download/${name}`, '_blank');
  };

  const handleDriveFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setDriveFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const saveDriveConfig = async () => {
    try {
      setLoading(true);
      if (driveFormData._id) {
        await axios.put(`/backup/drive-configs/${driveFormData._id}`, driveFormData);
        toast.success("Drive configuration updated!");
      } else {
        const payload: any = { ...driveFormData };
        delete payload._id;
        await axios.post("/backup/drive-configs", payload);
        toast.success("Drive configuration created!");
      }
      setShowDriveModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save drive configuration");
    } finally {
      setLoading(false);
    }
  };

  const deleteDriveConfig = async (id: string) => {
    const confirmed = await AlertService.confirm("Delete Config?", "Are you sure you want to delete this configuration?");
    if (!confirmed) return;
    try {
      setLoading(true);
      await axios.delete(`/backup/drive-configs/${id}`);
      toast.success("Drive configuration deleted!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete configuration");
    } finally {
      setLoading(false);
    }
  };

  const setActiveDriveConfig = async (id: string) => {
    try {
      setLoading(true);
      await axios.put(`/backup/drive-configs/${id}`, { isActive: true });
      toast.success("Active configuration updated!");
      fetchData();
    } catch (error) {
      toast.error("Failed to set active configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setTelegramFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const saveTelegramConfig = async () => {
    try {
      setLoading(true);
      if (telegramFormData._id) {
        await axios.put(`/backup/telegram-configs/${telegramFormData._id}`, telegramFormData);
        toast.success("Telegram configuration updated!");
      } else {
        const payload: any = { ...telegramFormData };
        delete payload._id;
        await axios.post("/backup/telegram-configs", payload);
        toast.success("Telegram configuration created!");
      }
      setShowTelegramModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save telegram configuration");
    } finally {
      setLoading(false);
    }
  };

  const deleteTelegramConfig = async (id: string) => {
    const confirmed = await AlertService.confirm("Delete Config?", "Are you sure you want to delete this configuration?");
    if (!confirmed) return;
    try {
      setLoading(true);
      await axios.delete(`/backup/telegram-configs/${id}`);
      toast.success("Telegram configuration deleted!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete configuration");
    } finally {
      setLoading(false);
    }
  };

  const setActiveTelegramConfig = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      await axios.put(`/backup/telegram-configs/${id}`, { isActive: !currentStatus });
      toast.success("Active configuration updated!");
      fetchData();
    } catch (error) {
      toast.error("Failed to set active configuration");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    if (!file.name.endsWith('.zip')) {
      toast.error("Only ZIP files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading backup...");
    try {
      setLoading(true);
      await axios.post("/backup/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Backup uploaded successfully!", { id: toastId });
      fetchData();
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/zip": [".zip"] },
    multiple: false
  });

  const filteredBackups = backups.filter((b: any) => {
    if (activeTab === "All") return true;
    return b.type === activeTab;
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SideBar />
        </div>
        <div className="col-md-10">
             <Header title="Backup & Restore" />
          <div className="mt-3">
             <p className="text-muted">Manage backups and restore your data</p>
             
             {/* AUTOMATIC SCHEDULE */}
             <Card className="mb-4 shadow-sm border-0">
               <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                     <div>
                       <h6 className="fw-bold mb-1">Automatic Backup Schedule</h6>
                       <small className="text-muted">Configure automatic backups to protect your data.</small>
                     </div>
                     <Button variant="outline-dark" size="sm" onClick={saveSettings} disabled={loading}>
                       <Icons.SaveOutline size={16} className="me-1" /> Save Settings
                     </Button>
                  </div>
                  
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded flex-wrap">
                     <Form.Check 
                       type="switch"
                       id="auto-backup-switch"
                       label="Auto Backup"
                       className="fw-bold"
                       name="autoBackup"
                       checked={settings.autoBackup}
                       onChange={handleSettingsChange}
                     />
                     <div className="d-flex align-items-center gap-2">
                        <span className="ms-3 text-muted">Every</span>
                        <Form.Select size="sm" name="frequency" value={settings.frequency} onChange={handleSettingsChange} style={{ width: "100px" }}>
                           <option value="Day">Day</option>
                           <option value="Week">Week</option>
                           <option value="Month">Month</option>
                        </Form.Select>
                     </div>
                     <div className="d-flex align-items-center gap-2">
                        <span className="text-muted">at</span>
                        <Form.Control type="time" size="sm" name="time" value={settings.time} onChange={handleSettingsChange} style={{ width: "120px" }} />
                     </div>
                     <div className="d-flex align-items-center gap-2">
                        <span className="text-muted">taking</span>
                        <Form.Select size="sm" name="backupType" value={settings.backupType} onChange={handleSettingsChange} style={{ width: "120px" }}>
                           <option value="Full">Full</option>
                           <option value="Database">Database</option>
                           <option value="Files">Files</option>
                        </Form.Select>
                        <span className="text-muted">backup</span>
                     </div>
                     
                     <div className="ms-auto d-flex align-items-center">
                        <Form.Check 
                           type="switch"
                           id="sync-drive-switch"
                           label="Sync to Drive"
                           className="fw-bold"
                           name="syncToDrive"
                           checked={settings.syncToDrive}
                           onChange={handleSettingsChange}
                        />
                     </div>
                  </div>
               </Card.Body>
             </Card>

             {/* CREATE NEW BACKUP */}
             <Card className="mb-4 shadow-sm border-0">
               <Card.Body>
                  <h6 className="fw-bold mb-1">Create New Backup</h6>
                  <small className="text-muted">Choose the type of backup you want to create</small>
                  
                  <div className="row mt-3">
                     <div className="col-md-4">
                        <div className="p-4 border rounded text-center" style={{ cursor: "pointer", transition: "0.2s" }} onClick={() => createBackup("Database")}>
                           <Icons.DatabaseOutline size={30} className="mb-2 text-dark" />
                           <h6 className="fw-bold mb-1">Database</h6>
                           <small className="text-muted">Backup database only</small>
                        </div>
                     </div>
                     <div className="col-md-4">
                        <div className="p-4 border rounded text-center" style={{ cursor: "pointer", transition: "0.2s" }} onClick={() => createBackup("Files")}>
                           <Icons.DocumentDuplicateOutline size={30} className="mb-2 text-dark" />
                           <h6 className="fw-bold mb-1">Files</h6>
                           <small className="text-muted">Backup files only</small>
                        </div>
                     </div>
                     <div className="col-md-4">
                        <div className="p-4 border rounded text-center" style={{ cursor: "pointer", transition: "0.2s" }} onClick={() => createBackup("Full")}>
                           <Icons.ServerOutline size={30} className="mb-2 text-dark" />
                           <h6 className="fw-bold mb-1">Full Backup</h6>
                           <small className="text-muted">Database + Files</small>
                        </div>
                     </div>
                  </div>
               </Card.Body>
             </Card>

             {/* UPLOAD BACKUP */}
             <Card className="mb-4 shadow-sm border-0">
               <Card.Body>
                  <h6 className="fw-bold mb-1">Upload Backup</h6>
                  <small className="text-muted">Upload an existing backup file to restore later</small>
                  
                  <div {...getRootProps()} className="mt-3 p-5 border border-dashed rounded text-center" style={{ cursor: "pointer", backgroundColor: isDragActive ? "#f8f9fa" : "white" }}>
                     <input {...getInputProps()} />
                     <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-3 mb-3">
                        <Icons.UploadOutline size={30} className="text-muted" />
                     </div>
                     <h6 className="fw-bold text-dark">Drag and drop your backup file here, or click to browse</h6>
                     <small className="text-muted">Only ZIP files up to 2GB are accepted</small>
                  </div>
               </Card.Body>
             </Card>

             {/* AVAILABLE BACKUPS */}
             <Card className="mb-5 shadow-sm border-0">
               <Card.Body>
                  <h6 className="fw-bold mb-1">Available Backups</h6>
                  <small className="text-muted">{backups.length} backups available</small>
                  
                  <div className="d-flex gap-2 mt-3 bg-light p-2 rounded">
                     {["All", "Database", "Files", "Full", "Drive Settings", "Telegram Settings"].map((tab) => (
                        <Button 
                           key={tab} 
                           variant={activeTab === tab ? "white" : "transparent"} 
                           className={`border-0 flex-grow-1 fw-bold ${activeTab === tab ? "shadow-sm text-dark" : "text-muted"}`}
                           onClick={() => setActiveTab(tab)}
                        >
                           {tab} {!["Drive Settings", "Telegram Settings"].includes(tab) && `(${tab === "All" ? backups.length : backups.filter((b: any) => b.type === tab).length})`}
                        </Button>
                     ))}
                  </div>

                  <div className="mt-4">
                     {activeTab === "Drive Settings" ? (
                        <div className="p-3">
                           <div className="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                 <h6 className="fw-bold mb-0">Google Drive Integrations</h6>
                                 <small className="text-muted">Manage your connected Google Drive accounts.</small>
                              </div>
                              <Button 
                                 variant="dark" 
                                 size="sm" 
                                 onClick={() => {
                                    setDriveFormData({ _id: "", name: "", folderId: "", serviceAccountJson: "", isActive: false });
                                    setShowDriveModal(true);
                                 }}
                              >
                                 <Icons.PlusOutline size={16} className="me-1" /> Add Configuration
                              </Button>
                           </div>
                           <Table responsive hover className="align-middle border">
                              <thead className="bg-light">
                                 <tr>
                                    <th>Name</th>
                                    <th>Folder ID</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th className="text-end">Actions</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {driveConfigs.length > 0 ? (
                                    driveConfigs.map((config: any) => (
                                       <tr key={config._id}>
                                          <td className="fw-bold">{config.name}</td>
                                          <td className="text-muted"><small>{config.folderId}</small></td>
                                          <td>
                                             {config.isActive ? (
                                                <span className="badge bg-success rounded-pill">Active</span>
                                             ) : (
                                                <Button variant="outline-secondary" size="sm" onClick={() => setActiveDriveConfig(config._id)} style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem' }}>
                                                   Set Active
                                                </Button>
                                             )}
                                          </td>
                                          <td><small className="text-muted">{new Date(config.createdAt).toLocaleDateString()}</small></td>
                                          <td className="text-end">
                                             <Button variant="link" className="text-dark p-1" onClick={() => { setDriveFormData(config); setShowDriveModal(true); }}>
                                                <Icons.PencilOutline size={18} />
                                             </Button>
                                             <Button variant="link" className="text-danger p-1 ms-2" onClick={() => deleteDriveConfig(config._id)}>
                                                <Icons.TrashOutline size={18} />
                                             </Button>
                                          </td>
                                       </tr>
                                    ))
                                 ) : (
                                    <tr>
                                       <td colSpan={5} className="text-center py-4 text-muted">No Google Drive configurations found.</td>
                                    </tr>
                                 )}
                              </tbody>
                           </Table>
                        </div>
                     ) : activeTab === "Telegram Settings" ? (
                        <div className="p-3">
                           <div className="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                 <h6 className="fw-bold mb-0">Telegram Chatbots</h6>
                                 <small className="text-muted">Manage your Telegram bots to receive backup alerts.</small>
                              </div>
                              <Button 
                                 variant="dark" 
                                 size="sm" 
                                 onClick={() => {
                                    setTelegramFormData({ _id: "", name: "", botToken: "", chatId: "", isActive: false });
                                    setShowTelegramModal(true);
                                 }}
                              >
                                 <Icons.PlusOutline size={16} className="me-1" /> Add Chatbot
                              </Button>
                           </div>
                           <Table responsive hover className="align-middle border">
                              <thead className="bg-light">
                                 <tr>
                                    <th>Bot Name</th>
                                    <th>Chat ID</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th className="text-end">Actions</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {telegramConfigs.length > 0 ? (
                                    telegramConfigs.map((config: any) => (
                                       <tr key={config._id}>
                                          <td className="fw-bold">{config.name}</td>
                                          <td className="text-muted"><small>{config.chatId}</small></td>
                                          <td>
                                             {config.isActive ? (
                                                <Button variant="success" size="sm" onClick={() => setActiveTelegramConfig(config._id, config.isActive)} style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem' }}>
                                                   Active
                                                </Button>
                                             ) : (
                                                <Button variant="outline-secondary" size="sm" onClick={() => setActiveTelegramConfig(config._id, config.isActive)} style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem' }}>
                                                   Inactive
                                                </Button>
                                             )}
                                          </td>
                                          <td><small className="text-muted">{new Date(config.createdAt).toLocaleDateString()}</small></td>
                                          <td className="text-end">
                                             <Button variant="link" className="text-dark p-1" onClick={() => { setTelegramFormData(config); setShowTelegramModal(true); }}>
                                                <Icons.PencilOutline size={18} />
                                             </Button>
                                             <Button variant="link" className="text-danger p-1 ms-2" onClick={() => deleteTelegramConfig(config._id)}>
                                                <Icons.TrashOutline size={18} />
                                             </Button>
                                          </td>
                                       </tr>
                                    ))
                                 ) : (
                                    <tr>
                                       <td colSpan={5} className="text-center py-4 text-muted">No Telegram configurations found.</td>
                                    </tr>
                                 )}
                              </tbody>
                           </Table>
                        </div>
                     ) : (
                        <Table responsive hover className="align-middle">
                           <tbody>
                              {filteredBackups.length > 0 ? (
                                 filteredBackups.map((backup: any) => (
                                    <tr key={backup._id}>
                                       <td>
                                          <div className="d-flex align-items-center gap-2">
                                             <Icons.DatabaseOutline size={20} className="text-muted" />
                                             <h6 className="mb-0 fw-bold">{backup.name}</h6>
                                             <span className="badge bg-dark text-white rounded-pill px-2 py-1">valid</span>
                                             <span className="badge bg-light border text-dark rounded-pill px-2 py-1">{backup.type}</span>
                                          </div>
                                          <small className="text-muted ms-4">
                                             {backup.size} &middot; {new Date(backup.createdAt).toLocaleString()}
                                          </small>
                                       </td>
                                       <td className="text-end">
                                          <Button variant="link" className="text-dark p-1" onClick={() => downloadBackup(backup.name)}>
                                             <Icons.DownloadOutline size={20} />
                                          </Button>
                                          <Button variant="link" className="text-dark p-1 ms-2" onClick={() => restoreBackup(backup._id)}>
                                             <Icons.RefreshOutline size={20} />
                                          </Button>
                                          <Button variant="link" className="text-danger p-1 ms-2" onClick={() => deleteBackup(backup._id)}>
                                             <Icons.TrashOutline size={20} />
                                          </Button>
                                       </td>
                                    </tr>
                                 ))
                              ) : (
                                 <tr>
                                    <td colSpan={2} className="text-center py-5 text-muted">
                                       No backups found.
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </Table>
                     )}
                  </div>
               </Card.Body>
             </Card>

          </div>
        </div>
      </div>
      <Modal show={showDriveModal} onHide={() => setShowDriveModal(false)} centered size="lg">
         <Modal.Header closeButton>
            <Modal.Title>{driveFormData._id ? "Edit" : "Add"} Drive Configuration</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <Form>
               <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Configuration Name</Form.Label>
                  <Form.Control type="text" name="name" value={driveFormData.name} onChange={handleDriveFormChange} placeholder="e.g. Primary Drive" />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Folder ID</Form.Label>
                  <Form.Control type="text" name="folderId" value={driveFormData.folderId} onChange={handleDriveFormChange} placeholder="Google Drive Folder ID" />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Service Account JSON</Form.Label>
                  <Form.Control as="textarea" rows={8} name="serviceAccountJson" value={driveFormData.serviceAccountJson} onChange={handleDriveFormChange} placeholder='{"type": "service_account", ...}' style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
               </Form.Group>
            </Form>
         </Modal.Body>
         <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDriveModal(false)}>Cancel</Button>
            <Button variant="dark" onClick={saveDriveConfig} disabled={loading || !driveFormData.name || !driveFormData.folderId || !driveFormData.serviceAccountJson}>
               Save Configuration
            </Button>
         </Modal.Footer>
      </Modal>

      {/* Telegram Modal */}
      <Modal show={showTelegramModal} onHide={() => setShowTelegramModal(false)} centered size="lg">
         <Modal.Header closeButton>
            <Modal.Title>{telegramFormData._id ? "Edit" : "Add"} Telegram Chatbot</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <Form>
               <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Bot Name</Form.Label>
                  <Form.Control type="text" name="name" value={telegramFormData.name} onChange={handleTelegramFormChange} placeholder="e.g. TCM Notifications Bot" />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Bot Token</Form.Label>
                  <Form.Control type="text" name="botToken" value={telegramFormData.botToken} onChange={handleTelegramFormChange} placeholder="e.g. 123456:ABC-DEF1234ghIkl" />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Chat ID</Form.Label>
                  <Form.Control type="text" name="chatId" value={telegramFormData.chatId} onChange={handleTelegramFormChange} placeholder="e.g. 877939799" />
               </Form.Group>
            </Form>
         </Modal.Body>
         <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTelegramModal(false)}>Cancel</Button>
            <Button variant="dark" onClick={saveTelegramConfig} disabled={loading || !telegramFormData.name || !telegramFormData.botToken || !telegramFormData.chatId}>
               Save Chatbot
            </Button>
         </Modal.Footer>
      </Modal>

      {/* Restore Progress Modal */}
      <Modal show={showRestoreModal} backdrop="static" keyboard={false} centered>
         <Modal.Header>
            <Modal.Title>System Restore in Progress</Modal.Title>
         </Modal.Header>
         <Modal.Body className="text-center py-4">
            <h5 className="fw-bold mb-3">{restoreProgress}%</h5>
            <ProgressBar animated variant="primary" now={restoreProgress} className="mb-3" />
            <p className="text-muted mb-0">{restoreStatus}</p>
            <small className="text-danger mt-3 d-block">
               <Icons.ExclamationOutline size={16} className="me-1" />
               Please do not close this window or refresh the page.
            </small>
         </Modal.Body>
      </Modal>
    </div>
  );
};

export default BackupRestore;
