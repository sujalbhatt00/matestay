import React, { useState } from "react";
import { X, Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const RoomInquiryModal = ({ property, onClose, onSendMessage }) => {
  const [messageType, setMessageType] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customMessage, setCustomMessage] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messageTemplates = [
    {
      id: 1,
      title: "Shift Interest",
      template: (date) =>
        `Hi! I'm very interested in this property. I'm planning to shift from ${
          date || "next month"
        }. Can we discuss the details? Thanks!`,
    },
    {
      id: 2,
      title: "Quick Inquiry",
      template: () =>
        `Hello! This property looks great. Is it still available? I'd love to know more and possibly schedule a viewing. Thanks!`,
    },
    {
      id: 3,
      title: "Lease Terms",
      template: () =>
        `Hi! I'm interested in this room. Can you share more details about the lease terms, deposit, and move-in process? Thanks!`,
    },
    {
      id: 4,
      title: "Specific Questions",
      template: () =>
        `Hello! I have a few questions about the amenities and house rules. Also, is there any flexibility on the rent? Looking forward to hearing from you.`,
    },
    {
      id: 5,
      title: "Urgent/Immediate",
      template: () =>
        `Hi! I'm looking for accommodation urgently and your property seems perfect. I can move in immediately. Can we arrange a viewing soon? Thanks!`,
    },
  ];

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      let finalMessage = "";

      if (messageType === "template") {
        finalMessage = messageTemplates[selectedTemplate].template(shiftDate);
      } else {
        finalMessage = customMessage;
      }

      if (!finalMessage.trim()) {
        alert("Please enter a message");
        setIsLoading(false);
        return;
      }

      await onSendMessage(finalMessage);
      onClose();
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Message {property?.lister?.name || "Lister"}</h2>
            <p className="text-primary-foreground/80 text-sm mt-1">{property?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message Type Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Choose Message Type</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setMessageType("template")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  messageType === "template"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-foreground border border-border hover:bg-muted/80"
                }`}
              >
                Smart Templates
              </button>
              <button
                onClick={() => setMessageType("custom")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  messageType === "custom"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-foreground border border-border hover:bg-muted/80"
                }`}
              >
                Write Custom
              </button>
            </div>
          </div>

          {/* Template Selection */}
          {messageType === "template" && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Select a Template</Label>
              <div className="grid grid-cols-1 gap-3">
                {messageTemplates.map((template, idx) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(idx)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === idx
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{template.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {template.template("")}
                    </p>
                  </button>
                ))}
              </div>

              {/* Shift Date Input for Template */}
              {selectedTemplate === 0 && (
                <div className="space-y-2 bg-primary/10 p-4 rounded-lg border border-primary/25">
                  <Label htmlFor="shiftDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    When are you planning to shift? (Optional)
                  </Label>
                  <Input
                    id="shiftDate"
                    type="date"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    className="h-10"
                  />
                </div>
              )}

              {/* Preview */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">MESSAGE PREVIEW</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {messageTemplates[selectedTemplate].template(shiftDate || "")}
                </p>
              </div>
            </div>
          )}

          {/* Custom Message */}
          {messageType === "custom" && (
            <div className="space-y-3">
              <Label htmlFor="customMsg" className="text-base font-semibold">Write Your Message</Label>
              <Textarea
                id="customMsg"
                placeholder="Type your message here... Be polite and clear about your interest in the property."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-32 resize-none rounded-lg border-border"
              />
              <p className="text-xs text-muted-foreground">
                {customMessage.length}/500 characters
              </p>
            </div>
          )}

          {/* Send Button */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-11 rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="flex-1 h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInquiryModal;
