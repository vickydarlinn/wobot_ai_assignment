import { useState, useEffect } from "react";
import {
  FiMapPin,
  FiChevronDown,
  FiSearch,
  FiCloud,
  FiAlertCircle,
} from "react-icons/fi";
import logo from "../../assets/logo.svg";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import useFetchCameras from "../../hooks/useFetchCameras";
import useUpdateCameraStatus from "../../hooks/useUpdateCameraStatus";
import { useQuery } from "../../hooks/useQuery";
import Table, { type Column } from "../../components/table/Table";
import Dialog from "../../components/dialog";
import type { Camera } from "../../types";
import styles from "./cameraPage.module.css";
import { GoCircleSlash } from "react-icons/go";
import { RiRssLine, RiServerLine } from "react-icons/ri";

const CameraPage = () => {
  const { data, isLoading } = useFetchCameras();
  const { updateStatus } = useUpdateCameraStatus();
  const { queryParams, updateQueries } = useQuery();

  // Local state for cameras (to handle  deletes)
  const [cameras, setCameras] = useState<Camera[]>([]);

  // Initialize state from URL query params
  const [searchTerm, setSearchTerm] = useState(() => queryParams.search || "");
  const [locationFilter, setLocationFilter] = useState(
    () => queryParams.location || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    () => queryParams.status || ""
  );

  // Sync cameras with fetched data
  useEffect(() => {
    setCameras(data);
  }, [data]);

  // Get page size from URL
  const pageSize = parseInt(queryParams.limit || "10", 10);

  // Get unique locations and statuses for filters
  const locations = Array.from(new Set(cameras.map((cam) => cam.location)));
  const statuses = Array.from(new Set(cameras.map((cam) => cam.status)));

  // Apply filters
  const filteredData = cameras.filter((camera) => {
    const matchesLocation =
      !locationFilter || camera.location === locationFilter;
    const matchesStatus = !statusFilter || camera.status === statusFilter;
    return matchesLocation && matchesStatus;
  });

  // Handle status toggle
  const handleStatusToggle = async (camera: Camera) => {
    const newStatus = camera.status === "Active" ? "Inactive" : "Active";
    const cameraId = camera.id;

    await updateStatus({ id: cameraId, status: newStatus });
    setCameras((prev) =>
      prev.map((cam) =>
        cam.id === cameraId ? { ...cam, status: newStatus } : cam
      )
    );
  };

  // Handle delete
  const handleDelete = async (camera: Camera) => {
    setCameras((prev) => prev.filter((cam) => cam.id !== camera.id));
  };

  const columns: Column<Camera>[] = [
    {
      key: "name",
      header: "NAME",
      width: "250px",
      render: (row) => (
        <div className={styles.nameCell}>
          <div className={styles.nameRow}>
            <span
              className={styles.statusDot}
              style={{
                backgroundColor:
                  row.status === "Active" ? "#10b981" : "#ef4444",
              }}
            />
            <span className={styles.cameraName}>{row.name}</span>
            {row.hasWarning && <FiAlertCircle className={styles.warningIcon} />}
          </div>
          <div className={styles.cameraEmail}>{row.current_status}</div>
        </div>
      ),
    },
    {
      key: "health",
      header: "HEALTH",
      render: (row) => (
        <div className={styles.healthCell}>
          <div
            className={styles.healthIcon}
            title={`Cloud: ${row.health.cloud}`}
          >
            <FiCloud />
            <span className={styles.healthGradeRing}>
              <span className={styles.healthGradeLabel}>
                {row.health.cloud}
              </span>
            </span>
          </div>
          <div className={styles.healthIcon}>
            <RiServerLine />
            <span
              className={styles.healthGradeRing}
              style={{
                background: "conic-gradient(#10b981 0 75%, #e0e8fc 75% 100%)",
              }}
            >
              <span className={styles.healthGradeLabel}>
                {row.health.device}
              </span>
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "LOCATION",
      width: "200px",
    },
    {
      key: "recorder",
      header: "RECORDER",
      width: "200px",
      render: (row) => <span>{row.recorder ? row.recorder : "N/A"}</span>,
    },
    {
      key: "tasks",
      header: "TASKS",
      width: "120px",
      render: (row) => <span>{row.tasks} Tasks</span>,
    },
    {
      key: "status",
      header: "STATUS",
      width: "120px",
      render: (row) => (
        <span
          className={styles.statusBadge}
          style={{
            backgroundColor: row.status === "Active" ? "#d1fae5" : "#f3f4f6",
            color: row.status === "Active" ? "#065f46" : "#6b7280",
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "id",
      header: "ACTIONS",
      width: "140px",
      render: (row) => {
        const StatusIcon =
          row.status === "Active" ? GoCircleSlash : FaRegCheckCircle;

        const nextStatus = row.status === "Active" ? "Inactive" : "Active";

        return (
          <div className={styles.actionsCell}>
            <Dialog
              title={
                row.status === "Active"
                  ? "Make camera inactive?"
                  : "Make camera active?"
              }
              description={`This will change status to ${nextStatus} for "${row.name}".`}
              confirmLabel={`Yes, ${nextStatus}`}
              cancelLabel="Cancel"
              onConfirm={async () => {
                await handleStatusToggle(row);
              }}
            >
              <span
                className={styles.iconButton}
                title={
                  row.status === "Active" ? "Make Inactive" : "Make Active"
                }
              >
                <StatusIcon size={18} />
              </span>
            </Dialog>

            <Dialog
              title="Delete camera?"
              description={`This action will remove "${row.name}". This cannot be undone.`}
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={async () => {
                await handleDelete(row);
              }}
            >
              <span className={styles.iconButton} title="Delete camera">
                <MdDeleteOutline size={18} />
              </span>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Wobot AI Logo" />
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.pageHeader}>
            {/* Page Title */}
            <div>
              <h1 className={styles.pageTitle}>Cameras</h1>
              <p className={styles.pageSubtitle}>Manage your cameras here.</p>
            </div>
            {/* Search */}
            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="search"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  updateQueries({ search: value, page: "1" }, true);
                }}
              />
            </div>
          </div>

          {/* Filters and Search */}
          <div className={styles.controlsBar}>
            <div className={styles.filters}>
              {/* Location Filter */}
              <div className={styles.filterGroup}>
                <select
                  className={styles.filterSelect}
                  value={locationFilter}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocationFilter(value);
                    updateQueries({ location: value, page: "1" }, true);
                  }}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <FiMapPin className={styles.filterIcon} />
                <FiChevronDown className={styles.filterChevron} />
              </div>

              {/* Status Filter */}
              <div className={styles.filterGroup}>
                <select
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStatusFilter(value);
                    updateQueries({ status: value, page: "1" }, true);
                  }}
                >
                  <option value="">All Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <RiRssLine className={styles.filterIcon} />
                <FiChevronDown className={styles.filterChevron} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableSection}>
            <Table<Camera>
              data={filteredData}
              columns={columns}
              rowKey="id"
              searchTerm={searchTerm}
              searchKeys={["name", "location", "recorder", "current_status"]}
              pageSize={pageSize}
              loading={isLoading}
              enableSelection={true}
              emptyMessage="No cameras found"
              onPageSizeChange={(newSize: number) => {
                updateQueries({ limit: String(newSize), page: "1" }, true);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CameraPage;
