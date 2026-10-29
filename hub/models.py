from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field, model_validator
import time

class NodePacket(BaseModel):
    node: str = Field(..., description="Unique node identifier, e.g., 'node_a', 'node_b'")
    seq: int = Field(..., ge=1, description="Strictly monotonic sequence number per node")
    ts: float = Field(default_factory=time.time, description="Unix timestamp of sensor reading")
    d: Optional[Dict[str, Any]] = Field(default=None, description="Sensor/activity payload dictionary (agreed backend contract)")
    payload: Optional[Dict[str, Any]] = Field(default=None, description="Alternative alias for telemetry payload")
    sig: str = Field(..., description="HMAC-SHA256 signature of canonical payload")

    @model_validator(mode="after")
    def populate_payload(self):
        if self.d is None and self.payload is None:
            raise ValueError("Either 'd' or 'payload' dictionary must be provided")
        if self.d is not None and self.payload is None:
            self.payload = self.d
        elif self.payload is not None and self.d is None:
            self.d = self.payload
        return self

class BatchIngestRequest(BaseModel):
    packets: List[NodePacket] = Field(..., description="Buffered array of packets for offline recovery")

class CommuteRequest(BaseModel):
    mode: Literal["car_solo", "two_wheeler", "bus", "metro", "bicycle", "walking"] = Field(
        ..., description="Commute transportation mode"
    )
    km: Optional[float] = Field(default=None, description="Distance in km (defaults to standard trip distance if omitted)")
    source: Literal["kiosk", "phone"] = Field(default="kiosk", description="Origin of commute entry")

class FuelRequest(BaseModel):
    fuel: Literal["diesel", "petrol"] = Field(..., description="Type of fuel consumed")
    litres: float = Field(..., gt=0, description="Volume of fuel in litres")
    source: Literal["manual", "sensor_hotspot"] = Field(default="manual", description="Source of fuel activity data")

class RelayControlRequest(BaseModel):
    node: str = Field(..., description="Target node identifier")
    state: Literal["ON", "OFF"] = Field(..., description="Target relay state")
    reason: str = Field(..., description="Reason for state transition override")
    auth_token: Optional[str] = Field(default=None, description="Signed hub command authorization token")

class RunStartRequest(BaseModel):
    label: Literal["baseline", "optimized"] = Field(..., description="Type of comparative run")

class TamperDemoRequest(BaseModel):
    record_id: int = Field(..., description="Database record ID to silently tamper with")
    tampered_payload: Dict[str, Any] = Field(..., description="Tampered payload dictionary")
