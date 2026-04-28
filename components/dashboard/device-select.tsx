"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvailableDevicesOutput } from "@/lib/tinybird";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

interface DeviceSelectProps {
  devices: Promise<AvailableDevicesOutput[]>;
}

const DeviceSelect = ({ devices }: DeviceSelectProps) => {
  const devicesData = use(devices);
  const deviceList = devicesData.map((d) => d.device);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedDevice = searchParams.get("device") || "all";
  const router = useRouter();

  const handleDeviceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("device");
    } else {
      params.set("device", value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <Select onValueChange={handleDeviceChange} value={selectedDevice}>
      <SelectTrigger>
        <SelectValue placeholder="Select Device" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All Devices</SelectItem>
          {deviceList.map((device) => (
            <SelectItem key={device} value={device}>
              {device.charAt(0).toUpperCase() + device.slice(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceSelect;
