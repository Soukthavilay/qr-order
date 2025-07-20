"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Smartphone,
  CreditCard,
  MessageSquare,
  Bell,
  Users,
  BarChart3,
  Zap,
  CheckCircle,
  ExternalLink,
} from "lucide-react"

export function IntegrationPanel() {
  const [activeIntegrations, setActiveIntegrations] = useState<Set<string>>(new Set(["pos", "payments"]))

  const integrations = [
    {
      id: "pos",
      name: "POS System",
      description: "Connect with your existing point-of-sale system",
      icon: <Smartphone className="h-6 w-6" />,
      status: "connected",
      color: "bg-green-100 text-green-700",
      features: ["Real-time inventory sync", "Order management", "Sales reporting"],
    },
    {
      id: "payments",
      name: "Payment Gateway",
      description: "Accept digital payments and mobile wallets",
      icon: <CreditCard className="h-6 w-6" />,
      status: "connected",
      color: "bg-blue-100 text-blue-700",
      features: ["Credit/Debit cards", "Mobile wallets", "QR payments"],
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Send order confirmations via WhatsApp",
      icon: <MessageSquare className="h-6 w-6" />,
      status: "available",
      color: "bg-green-100 text-green-700",
      features: ["Order notifications", "Customer support", "Menu sharing"],
    },
    {
      id: "notifications",
      name: "Push Notifications",
      description: "Real-time notifications for staff and customers",
      icon: <Bell className="h-6 w-6" />,
      status: "available",
      color: "bg-purple-100 text-purple-700",
      features: ["Order alerts", "Kitchen notifications", "Customer updates"],
    },
    {
      id: "loyalty",
      name: "Loyalty Program",
      description: "Customer loyalty and rewards system",
      icon: <Users className="h-6 w-6" />,
      status: "available",
      color: "bg-yellow-100 text-yellow-700",
      features: ["Points system", "Rewards tracking", "Customer profiles"],
    },
    {
      id: "analytics",
      name: "Analytics Dashboard",
      description: "Advanced reporting and business insights",
      icon: <BarChart3 className="h-6 w-6" />,
      status: "available",
      color: "bg-indigo-100 text-indigo-700",
      features: ["Sales analytics", "Popular items", "Peak hours analysis"],
    },
  ]

  const toggleIntegration = (id: string) => {
    setActiveIntegrations((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 Integrations</h1>
        <p className="text-gray-600">Connect your restaurant with powerful third-party services</p>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="connected">Connected ({activeIntegrations.size})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${integration.color}`}>{integration.icon}</div>
                    <Badge
                      variant={integration.status === "connected" ? "default" : "outline"}
                      className={integration.status === "connected" ? "bg-green-100 text-green-700" : ""}
                    >
                      {integration.status === "connected" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        "Available"
                      )}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1 w-1 bg-gray-400 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={() => toggleIntegration(integration.id)}
                      variant={activeIntegrations.has(integration.id) ? "destructive" : "default"}
                      size="sm"
                      className="w-full"
                    >
                      {activeIntegrations.has(integration.id) ? "Disconnect" : "Connect"}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {integrations
              .filter((integration) => activeIntegrations.has(integration.id))
              .map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${integration.color}`}>{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-green-600 font-medium">Connected</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last sync:</span>
                        <span className="text-gray-900">2 minutes ago</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Configure Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure global integration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-restaurant.com/webhooks"
                  defaultValue="https://nomnom-cafe.com/api/webhooks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter your API key" defaultValue="••••••••••••••••" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="auto-sync" defaultChecked />
                <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
              </div>
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
